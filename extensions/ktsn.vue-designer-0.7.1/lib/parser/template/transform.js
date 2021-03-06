"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
function transformTemplate(body, code) {
    const transformed = body.startTag.attributes.map((attr, index) => transformAttribute(attr, index, code));
    const attrs = extractAttrs(transformed);
    return {
        type: 'Template',
        range: body.range,
        attrs,
        children: body.children.map((child, i) => transformChild(child, code, [i]))
    };
}
exports.transformTemplate = transformTemplate;
function transformElement(el, code, path) {
    const attrs = el.startTag.attributes.map((attr, index) => transformAttribute(attr, index, code));
    const start = startTag(extractAttrs(attrs), extractProps(attrs), extractDomProps(attrs), extractDirectives(attrs), el.startTag.selfClosing, el.startTag.range);
    const end = el.endTag && endtag(el.endTag.range);
    return element(path, el.name, start, end || undefined, el.children.map((child, i) => transformChild(child, code, path.concat(i))), el.range);
}
function extractAttrs(attrs) {
    const res = {};
    attrs.forEach(attr => {
        if (attr.type === 'Attribute') {
            res[attr.name] = attr;
        }
    });
    return res;
}
function extractProps(attrs) {
    const res = {};
    attrs.forEach(attr => {
        if (isProp(attr)) {
            res[attr.argument] = attr;
        }
    });
    return res;
}
function extractDomProps(attrs) {
    const res = {};
    attrs.forEach(attr => {
        if (isDomProp(attr)) {
            res[attr.argument] = attr;
        }
    });
    return res;
}
function extractDirectives(attrs) {
    return attrs.filter((attr) => {
        return attr.type === 'Directive' && !isProp(attr) && !isDomProp(attr);
    });
}
function transformAttribute(attr, index, code) {
    if (attr.directive) {
        if (attr.key.name === 'for') {
            const exp = attr.value &&
                attr.value.expression &&
                attr.value.expression.type === 'VForExpression'
                ? attr.value.expression
                : null;
            return vForDirective(index, exp ? exp.left.map(l => extractExpression(l, code)) : [], exp ? extractExpression(exp.right, code) : undefined, attr.range);
        }
        else {
            const exp = attr.value && attr.value.expression;
            const expStr = exp ? extractExpression(exp, code) : undefined;
            return directive(index, attr.key.name, attr.key.argument || undefined, attr.key.modifiers, expStr, attr.range);
        }
    }
    else {
        return attribute(index, attr.key.name, attr.value ? attr.value.value : undefined, attr.range);
    }
}
function transformChild(child, code, path) {
    switch (child.type) {
        case 'VElement':
            return transformElement(child, code, path);
        case 'VText':
            return textNode(path, child.value, child.range);
        case 'VExpressionContainer':
            const exp = child.expression;
            return expressionNode(path, exp ? extractExpression(exp, code) : '', child.range);
        default:
            return assert_1.default.fail('Unexpected node type: ' + child.type);
    }
}
function extractExpression(node, code) {
    return code.slice(node.range[0], node.range[1]);
}
function isProp(attr) {
    return (attr.type === 'Directive' &&
        attr.name === 'bind' &&
        !attr.modifiers.prop &&
        attr.argument !== undefined);
}
function isDomProp(attr) {
    return (attr.type === 'Directive' &&
        attr.name === 'bind' &&
        attr.modifiers.prop &&
        attr.argument !== undefined);
}
function element(path, name, startTag, endTag, children, range) {
    return {
        type: 'Element',
        path,
        name,
        startTag,
        endTag,
        children,
        range
    };
}
function startTag(attrs, props, domProps, directives, selfClosing, range) {
    return {
        type: 'StartTag',
        attrs,
        props,
        domProps,
        directives,
        selfClosing,
        range
    };
}
function endtag(range) {
    return {
        type: 'EndTag',
        range
    };
}
function textNode(path, text, range) {
    return {
        type: 'TextNode',
        path,
        text,
        range
    };
}
function expressionNode(path, expression, range) {
    return {
        type: 'ExpressionNode',
        path,
        expression,
        range
    };
}
function attribute(attrIndex, name, value, range) {
    return {
        type: 'Attribute',
        attrIndex,
        name,
        value,
        range
    };
}
function directive(attrIndex, name, argument, modifiers, expression, range) {
    const mod = {};
    modifiers.forEach(m => {
        mod[m] = true;
    });
    return {
        type: 'Directive',
        attrIndex,
        name,
        argument,
        modifiers: mod,
        expression,
        range
    };
}
function vForDirective(attrIndex, left, right, range) {
    return {
        type: 'Directive',
        attrIndex,
        name: 'for',
        modifiers: {},
        left,
        right,
        range
    };
}
