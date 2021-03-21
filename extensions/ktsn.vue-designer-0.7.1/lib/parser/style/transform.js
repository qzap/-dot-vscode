"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const postcss_selector_parser_1 = __importDefault(require("postcss-selector-parser"));
const codegen_1 = require("./codegen");
const utils_1 = require("../../utils");
function transformStyle(root, code, index) {
    if (!root.nodes) {
        return {
            path: [index],
            children: [],
            range: [-1, -1]
        };
    }
    const children = root.nodes
        .map((node, i) => {
        switch (node.type) {
            case 'atrule':
                return transformAtRule(node, [index, i], code);
            case 'rule':
                return transformRule(node, [index, i], code);
            default:
                return undefined;
        }
    })
        .filter((node) => {
        return node !== undefined;
    });
    return {
        path: [index],
        children,
        range: toRange(root.source, code)
    };
}
exports.transformStyle = transformStyle;
function transformAtRule(atRule, path, code) {
    const isNotComment = (node) => {
        return node.type !== 'comment';
    };
    const children = atRule.nodes ? atRule.nodes.filter(isNotComment) : [];
    return {
        type: 'AtRule',
        path,
        before: atRule.raws.before || '',
        after: atRule.raws.after || '',
        name: atRule.name,
        params: atRule.params,
        children: children.map((child, i) => {
            return transformChild(child, path.concat(i), code);
        }),
        range: toRange(atRule.source, code)
    };
}
function transformRule(rule, path, code) {
    const decls = rule.nodes ? rule.nodes.filter(isDeclaration) : [];
    const root = postcss_selector_parser_1.default().astSync(rule.selector);
    return {
        type: 'Rule',
        path,
        before: rule.raws.before || '',
        after: rule.raws.after || '',
        selectors: root.nodes.map(n => {
            // A child of root node is always selector
            const selectors = n.nodes;
            return transformSelector(selectors);
        }),
        children: decls.map((decl, i) => {
            return transformDeclaration(decl, path.concat(i), code);
        }),
        range: toRange(rule.source, code)
    };
}
function transformSelector(nodes) {
    const [first, ...tail] = nodes;
    return transformSelectorElement(emptySelector(), first, tail);
}
function transformSelectorElement(current, el, rest) {
    if (!el) {
        return current;
    }
    const [first, ...tail] = rest;
    switch (el.type) {
        case 'combinator':
            const next = emptySelector();
            next.leftCombinator = transformCombinator(el, current);
            return transformSelectorElement(next, first, tail);
        case 'pseudo':
            if (isPseudoElement(el)) {
                return transformPseudoElement(current, el, rest);
            }
            if (isPseudoClass(el)) {
                current.pseudoClass.push(transformPseudoClass(el));
            }
            else {
                assert_1.default.fail("[style] Unexpected selector node: it has type 'pseudo' but neither pseudo element nor pseudo class.");
            }
            break;
        case 'tag':
            current.tag = el.value;
            break;
        case 'id':
            current.id = el.value;
            break;
        case 'class':
            current.class.push(el.value);
            break;
        case 'universal':
            current.universal = true;
            break;
        case 'attribute':
            current.attributes.push(transformAttribute(el));
            break;
        default:
    }
    return transformSelectorElement(current, first, tail);
}
function transformPseudoClass(node) {
    const params = node.nodes;
    return {
        type: 'PseudoClass',
        value: node.value.replace(/^:/, ''),
        params: params.map(p => transformSelector(p.nodes))
    };
}
function transformPseudoElement(parent, el, rest) {
    const rawPseudoClass = utils_1.takeWhile(rest, isPseudoClass);
    parent.pseudoElement = {
        type: 'PseudoElement',
        value: el.value.replace(/^:{1,2}/, ''),
        pseudoClass: rawPseudoClass.map(transformPseudoClass)
    };
    // No simple selector can follows after a paseudo element
    const [first, ...tail] = utils_1.dropWhile(rest.slice(rawPseudoClass.length), el => !isCombinator(el));
    return transformSelectorElement(parent, first, tail);
}
function transformAttribute(attr) {
    return {
        type: 'Attribute',
        operator: attr.operator,
        name: attr.attribute,
        value: attr.raws.unquoted,
        insensitive: attr.insensitive || false
    };
}
function transformCombinator(comb, left) {
    return {
        type: 'Combinator',
        operator: comb.value,
        left
    };
}
function transformDeclaration(decl, path, code) {
    return {
        type: 'Declaration',
        path,
        before: decl.raws.before || '',
        after: decl.raws.after || '',
        prop: decl.prop,
        value: decl.value,
        important: decl.important || false,
        range: toRange(decl.source, code)
    };
}
function transformChild(child, path, code) {
    switch (child.type) {
        case 'atrule':
            return transformAtRule(child, path, code);
        case 'rule':
            return transformRule(child, path, code);
        case 'decl':
            return transformDeclaration(child, path, code);
        default:
            return assert_1.default.fail('[style] Unexpected child node type: ' + child.type);
    }
}
function toRange(source, code) {
    const start = source.start
        ? toOffset(source.start.line, source.start.column, code)
        : 0;
    // The postcss end position is short by one
    const end = source.end
        ? toOffset(source.end.line, source.end.column, code) + 1
        : code.length;
    return [start, end];
}
function toOffset(line, column, code) {
    const codeLines = code.split('\n');
    const beforeLines = codeLines.slice(0, line - 1);
    const beforeLength = beforeLines.reduce((acc, line) => {
        // +1 to include line break
        return acc + line.length + 1;
    }, 0);
    return beforeLength + column - 1;
}
function transformRuleForPrint(rule) {
    return {
        path: rule.path,
        selectors: rule.selectors.map(codegen_1.genSelector),
        children: rule.children.map(decl => ({
            path: decl.path,
            prop: decl.prop,
            value: decl.value,
            important: decl.important
        }))
    };
}
exports.transformRuleForPrint = transformRuleForPrint;
function emptySelector() {
    return {
        type: 'Selector',
        universal: false,
        class: [],
        attributes: [],
        pseudoClass: []
    };
}
function isDeclaration(node) {
    return node.type === 'decl';
}
function isCombinator(node) {
    return node.type === 'combinator';
}
function isPseudo(node) {
    return node.type === 'pseudo';
}
function isPseudoElement(node) {
    return (isPseudo(node) &&
        (node.value.startsWith('::') ||
            // Must support legacy pseudo element syntax
            // for the below values
            // See: https://www.w3.org/TR/selectors-4/#pseudo-element-syntax
            node.value === ':before' ||
            node.value === ':after' ||
            node.value === ':first-letter' ||
            node.value === ':first-line'));
}
function isPseudoClass(node) {
    return isPseudo(node) && !isPseudoElement(node);
}
