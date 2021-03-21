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
const manipulate_1 = require("./manipulate");
const modifier_1 = require("../modifier");
function insertComponentScript(ast, code, componentName, componentPath) {
    const options = manipulate_1.findComponentOptions(ast.body);
    if (!options)
        return [];
    const componentOptions = manipulate_1.findProperty(options.properties, 'components');
    if (!componentOptions) {
        return [
            insertComponentImport(ast, code, componentName, componentPath),
            insertComponentOptions(options, code, componentName)
        ];
    }
    const value = componentOptions.value;
    if (!t.isObjectExpression(value))
        return [];
    return [
        insertComponentImport(ast, code, componentName, componentPath),
        insertComponentOptionItem(value, code, componentName)
    ];
}
exports.insertComponentScript = insertComponentScript;
function insertComponentImport(ast, code, componentName, componentPath) {
    assert_1.default(ast.body[0], '[modifier] script block should have at least one statement.');
    const imports = ast.body.filter(el => t.isImportDeclaration(el));
    const lastImport = imports[imports.length - 1];
    const indent = inferScriptIndent(code, lastImport || ast.body[0]);
    const insertedCode = `import ${componentName} from '${componentPath}'`;
    if (lastImport) {
        return modifier_1.insertAt(lastImport.end, '\n' + indent + insertedCode);
    }
    else {
        return modifier_1.insertAt(ast.body[0].start, insertedCode + '\n' + indent);
    }
}
function insertComponentOptions(options, code, componentName) {
    const indent = inferScriptIndent(code, options) + modifier_1.singleIndentStr;
    const comma = options.properties.length > 0 ? ',' : '';
    // prettier-ignore
    const value = [
        '',
        indent + 'components: {',
        indent + modifier_1.singleIndentStr + componentName,
        indent + '}' + comma,
        ''
    ].join('\n');
    return modifier_1.insertAt(options.start + 1, value);
}
function insertComponentOptionItem(componentOptions, code, componentName) {
    const indent = inferScriptIndent(code, componentOptions) + modifier_1.singleIndentStr;
    const { start, end } = componentOptions;
    const shouldAddComma = !/\{\s*\}$/.test(code.slice(start, end));
    const comma = shouldAddComma ? ',' : '';
    const properties = componentOptions.properties;
    const lastProperty = properties[properties.length - 1];
    const insertedCode = comma + '\n' + indent + componentName;
    if (lastProperty) {
        return modifier_1.insertAt(lastProperty.end, insertedCode);
    }
    else {
        return modifier_1.insertAt(start + 1, insertedCode);
    }
}
function inferScriptIndent(code, node) {
    const pre = code.slice(0, node.end);
    const match = /[\^\n]([\t ]+).*$/.exec(pre);
    if (match) {
        return match[1];
    }
    else {
        return '';
    }
}
