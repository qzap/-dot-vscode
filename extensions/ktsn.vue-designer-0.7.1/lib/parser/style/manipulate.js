"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const utils_1 = require("../../utils");
exports.scopePrefix = 'data-scope-';
function visitStyle(style, visitor) {
    function apply(node, visitor) {
        return visitor ? visitor(node) || node : node;
    }
    function loop(node) {
        switch (node.type) {
            case 'AtRule':
                return utils_1.clone(apply(node, visitor.atRule), {
                    children: node.children.map(loop)
                });
            case 'Rule':
                return utils_1.clone(apply(node, visitor.rule), {
                    selectors: node.selectors.map(selector => {
                        return visitor.lastSelector && isInterestSelector(node, style)
                            ? visitor.lastSelector(selector, node) || selector
                            : selector;
                    }),
                    children: node.children.map(loop)
                });
            case 'Declaration':
                return apply(node, visitor.declaration);
            default:
                return assert_1.default.fail('Unexpected node type: ' + node.type);
        }
    }
    return utils_1.clone(style, {
        children: style.children.map(loop)
    });
}
function visitLastSelectors(root, fn) {
    return visitStyle(root, { lastSelector: fn });
}
exports.visitLastSelectors = visitLastSelectors;
/**
 * Excludes selectors in @keyframes
 */
function isInterestSelector(rule, root) {
    const atRules = rule.path
        .slice(1)
        .reduce((nodes, index) => {
        const prev = (nodes[nodes.length - 1] || root);
        assert_1.default('children' in prev, '[style manipulate] the rule probably has an invalid path.');
        return nodes.concat(prev.children[index]);
    }, [])
        .filter((n) => n.type === 'AtRule');
    return atRules.every(r => !/-?keyframes$/.test(r.name));
}
function resolveAsset(style, basePath, resolver) {
    return visitStyle(style, {
        declaration: decl => {
            const value = decl.value;
            const replaced = value.replace(/url\(([^)]+)\)/g, (_, p) => {
                const unquoted = utils_1.unquote(p);
                const resolved = resolver.pathToUrl(unquoted, basePath);
                return 'url(' + (resolved ? JSON.stringify(resolved) : p) + ')';
            });
            return replaced !== value
                ? utils_1.clone(decl, {
                    value: replaced
                })
                : decl;
        }
    });
}
exports.resolveAsset = resolveAsset;
function addScope(node, scope) {
    const keyframes = new Map();
    const keyframesReplaced = visitStyle(node, {
        atRule(atRule) {
            if (/-?keyframes$/.test(atRule.name)) {
                const replaced = atRule.params + '-' + scope;
                keyframes.set(atRule.params, replaced);
                return utils_1.clone(atRule, {
                    params: replaced
                });
            }
        }
    });
    return visitStyle(keyframesReplaced, {
        declaration: decl => {
            // individual animation-name declaration
            if (/^(-\w+-)?animation-name$/.test(decl.prop)) {
                return utils_1.clone(decl, {
                    value: decl.value
                        .split(',')
                        .map(v => keyframes.get(v.trim()) || v.trim())
                        .join(',')
                });
            }
            // shorthand
            if (/^(-\w+-)?animation$/.test(decl.prop)) {
                return utils_1.clone(decl, {
                    value: decl.value
                        .split(',')
                        .map(v => {
                        const vals = v.trim().split(/\s+/);
                        const i = vals.findIndex(val => keyframes.has(val));
                        if (i !== -1) {
                            vals.splice(i, 1, keyframes.get(vals[i]));
                            return vals.join(' ');
                        }
                        else {
                            return v;
                        }
                    })
                        .join(',')
                });
            }
        },
        lastSelector: selector => {
            return utils_1.clone(selector, {
                attributes: selector.attributes.concat({
                    type: 'Attribute',
                    name: exports.scopePrefix + scope,
                    insensitive: false
                })
            });
        }
    });
}
exports.addScope = addScope;
function getNode(styles, path) {
    return path.reduce((acc, i) => {
        if (acc && acc.children) {
            return acc.children[i];
        }
        return undefined;
    }, { children: styles });
}
exports.getNode = getNode;
function getDeclaration(styles, path) {
    const res = getNode(styles, path);
    return res && res.type === 'Declaration' ? res : undefined;
}
exports.getDeclaration = getDeclaration;
