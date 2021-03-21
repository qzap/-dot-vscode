"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const t = __importStar(require("@babel/types"));
function extractProps(program) {
    const options = findComponentOptions(program.body);
    if (!options)
        return [];
    const props = findProperty(options.properties, 'props');
    if (!props)
        return [];
    if (t.isObjectExpression(props.value)) {
        return props.value.properties.filter(isStaticProperty).map(p => {
            const key = p.key;
            return {
                name: getStaticKeyName(key),
                type: getPropType(p.value),
                default: getPropDefault(p.value)
            };
        });
    }
    else if (t.isArrayExpression(props.value)) {
        return props.value.elements
            .filter((el) => !!el && isStringLiteral(el))
            .map(el => {
            return {
                name: el.value,
                type: 'any',
                default: undefined
            };
        });
    }
    else {
        return [];
    }
}
exports.extractProps = extractProps;
function extractData(program) {
    const options = findComponentOptions(program.body);
    if (!options)
        return [];
    const data = findPropertyOrMethod(options.properties, 'data');
    if (!data)
        return [];
    const obj = getDataObject(data);
    if (!obj)
        return [];
    return obj.properties.filter(isStaticProperty).map(p => {
        const key = p.key;
        return {
            name: getStaticKeyName(key),
            default: getLiteralValue(p.value)
        };
    });
}
exports.extractData = extractData;
function extractChildComponents(program, uri, localPathToUri) {
    const imports = getImportDeclarations(program.body);
    const options = findComponentOptions(program.body);
    if (!options)
        return [];
    const childComponents = [];
    const selfName = findProperty(options.properties, 'name');
    if (selfName && isStringLiteral(selfName.value)) {
        childComponents.push({
            name: selfName.value.value,
            uri
        });
    }
    const components = findProperty(options.properties, 'components');
    if (components) {
        childComponents.push(...extractComponents(components, imports, localPathToUri));
    }
    const lifecycle = findPropertyOrMethod(options.properties, 'beforeCreate');
    if (lifecycle) {
        childComponents.push(...extractLazyAddComponents(lifecycle, imports, localPathToUri));
    }
    return childComponents;
}
exports.extractChildComponents = extractChildComponents;
function extractComponents(prop, imports, localPathToUri) {
    if (!t.isObjectExpression(prop.value)) {
        return [];
    }
    function notUndef(p) {
        return p !== undefined;
    }
    return prop.value.properties
        .map((p) => {
        if (!isStaticProperty(p) || !t.isIdentifier(p.value)) {
            return undefined;
        }
        return findMatchingComponent(getStaticKeyName(p.key), p.value.name, imports, localPathToUri);
    })
        .filter(notUndef);
}
function extractLazyAddComponents(prop, imports, localPathToUri) {
    const func = normalizeMethod(prop);
    if (!func || !t.isBlockStatement(func.body)) {
        return [];
    }
    function notUndef(p) {
        return p !== undefined;
    }
    // Extract all `this.$options.components.LocalComponentName = ComponentName`
    return func.body.body
        .map((st) => {
        // We leave this chack as loosely since the user may not write
        // `this.$options.components.LocalComponentName = ComponentName`
        // but assign `components` to another variable to save key types.
        // If there are false positive in this check, they probably be
        // proned by maching with imported components in later.
        if (!t.isExpressionStatement(st) ||
            !t.isAssignmentExpression(st.expression) ||
            !t.isIdentifier(st.expression.right) || // = ComponentName
            !t.isMemberExpression(st.expression.left) ||
            !t.isIdentifier(st.expression.left.property) // .LocalComponentName
        ) {
            return undefined;
        }
        return findMatchingComponent(st.expression.right.name, st.expression.left.property.name, imports, localPathToUri);
    })
        .filter(notUndef);
}
function getImportDeclarations(body) {
    const res = {};
    body.forEach(node => {
        if (!t.isImportDeclaration(node))
            return;
        // Collect all declared local variables in import declaration into record
        // to store all possible components.
        node.specifiers.forEach(s => {
            res[s.local.name] = node;
        });
    });
    return res;
}
function findMatchingComponent(localName, importedName, imports, localPathToUri) {
    const componentImport = imports[importedName];
    if (!componentImport)
        return undefined;
    const sourcePath = componentImport.source.value;
    assert_1.default(typeof sourcePath === 'string', '[script] Import declaration unexpectedly has non-string literal: ' +
        sourcePath);
    return {
        name: localName,
        uri: localPathToUri(sourcePath)
    };
}
function isStringLiteral(node) {
    return t.isStringLiteral(node);
}
/**
 * Check if the property has a statically defined key
 * If it returns `true`, `node.key` should be `StaticKey`.
 */
function isStaticProperty(node) {
    return t.isObjectProperty(node) && !node.computed;
}
function isStaticPropertyOrMethod(node) {
    return isStaticProperty(node) || (t.isObjectMethod(node) && !node.computed);
}
function getStaticKeyName(key) {
    return t.isIdentifier(key) ? key.name : String(key.value);
}
/**
 * Find a property name that matches the specified property name.
 */
function findProperty(props, name) {
    return props.filter(isStaticProperty).find(p => {
        const key = p.key;
        return getStaticKeyName(key) === name;
    });
}
exports.findProperty = findProperty;
function findPropertyOrMethod(props, name) {
    return props.filter(isStaticPropertyOrMethod).find(p => {
        const key = p.key;
        return getStaticKeyName(key) === name;
    });
}
/**
 * Return function-like node if object property has
 * function value or it is a method.
 * Return undefined if it does not have a function value.
 */
function normalizeMethod(prop) {
    if (t.isObjectMethod(prop)) {
        return prop;
    }
    if (t.isFunction(prop.value)) {
        return prop.value;
    }
    return undefined;
}
/**
 * Detect `Vue.extend(...)`
 */
function isVueExtend(node) {
    if (!t.isCallExpression(node) || !t.isMemberExpression(node.callee)) {
        return false;
    }
    const property = node.callee.property;
    if (!t.isIdentifier(property, { name: 'extend' })) {
        return false;
    }
    const object = node.callee.object;
    if (!object || !t.isIdentifier(object, { name: 'Vue' })) {
        return false;
    }
    return true;
}
function getPropType(value) {
    if (t.isIdentifier(value)) {
        // Constructor
        return value.name;
    }
    else if (t.isObjectExpression(value)) {
        // Detailed prop definition
        // { type: ..., ... }
        const type = findProperty(value.properties, 'type');
        if (type && t.isIdentifier(type.value)) {
            return type.value.name;
        }
    }
    return 'any';
}
function getPropDefault(value) {
    if (t.isObjectExpression(value)) {
        // Find `default` property in the prop option.
        const def = findPropertyOrMethod(value.properties, 'default');
        if (def) {
            // If it is a function, extract default value from it,
            // otherwise just use the value.
            const func = normalizeMethod(def);
            if (func) {
                const exp = getReturnedExpression(func.body);
                return exp && getLiteralValue(exp);
            }
            else {
                return getLiteralValue(def.value);
            }
        }
    }
    return undefined;
}
function getDataObject(prop) {
    // If the value is an object expression, just return it.
    if (t.isObjectProperty(prop)) {
        const value = prop.value;
        if (t.isObjectExpression(value)) {
            return value;
        }
    }
    // If the value is a function, return the returned object expression
    const func = normalizeMethod(prop);
    if (func) {
        const exp = getReturnedExpression(func.body);
        if (exp && t.isObjectExpression(exp)) {
            return exp;
        }
    }
    return undefined;
}
/**
 * Extract returned expression in function body.
 * The function `body` should be `BlockStatement` in the declared type
 * but it can be other expressions if it forms like `() => ({ foo: 'bar' })`
 */
function getReturnedExpression(block) {
    if (t.isBlockStatement(block)) {
        const statements = block.body.slice().reverse();
        for (const s of statements) {
            if (t.isReturnStatement(s)) {
                return s.argument || undefined;
            }
        }
    }
    else {
        return block;
    }
}
function getLiteralValue(node) {
    // Simple literals like number, string and boolean
    if (t.isStringLiteral(node) ||
        t.isNumericLiteral(node) ||
        t.isBooleanLiteral(node)) {
        return node.value;
    }
    if (t.isNullLiteral(node)) {
        return null;
    }
    // Object literal
    if (t.isObjectExpression(node)) {
        const obj = {};
        node.properties.forEach(p => {
            if (!t.isObjectProperty(p)) {
                return;
            }
            if (p.computed || !t.isIdentifier(p.key)) {
                return;
            }
            obj[p.key.name] = getLiteralValue(p.value);
        });
        return obj;
    }
    // Array literal
    if (t.isArrayExpression(node)) {
        function notNull(x) {
            return !!x;
        }
        return node.elements.filter(notNull).map(getLiteralValue);
    }
    return undefined;
}
function findComponentOptions(body) {
    const exported = body.find((n) => t.isExportDefaultDeclaration(n));
    if (!exported)
        return undefined;
    // TODO: support class style component
    const dec = exported.declaration;
    if (t.isObjectExpression(dec)) {
        // Using object literal definition
        // export default {
        //   ...
        // }
        return dec;
    }
    else if (isVueExtend(dec) && t.isObjectExpression(dec.arguments[0])) {
        // Using Vue.extend with object literal
        // export default Vue.extend({
        //   ...
        // })
        return dec.arguments[0];
    }
    return undefined;
}
exports.findComponentOptions = findComponentOptions;
