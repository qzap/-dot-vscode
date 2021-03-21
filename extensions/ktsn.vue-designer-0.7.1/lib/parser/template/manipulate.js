"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const manipulate_1 = require("../style/manipulate");
const utils_1 = require("../../utils");
function getNode(root, path) {
    function loop(current, rest) {
        // If `rest` does not have any items,
        // `current` is the node we are looking for.
        if (rest.length === 0) {
            return current;
        }
        // The current node does not have children,
        // then we cannot traverse any more.
        if (current.type !== 'Element') {
            return undefined;
        }
        const next = current.children[rest[0]];
        if (!next) {
            return undefined;
        }
        else {
            return loop(next, rest.slice(1));
        }
    }
    const [index, ...rest] = path;
    const el = root.children[index];
    return el && loop(el, rest);
}
exports.getNode = getNode;
function insertNode(root, path, el) {
    function loop(parent, index, rest) {
        assert_1.default(index != null, '[template] index should not be null or undefined');
        const cs = parent.children;
        // If `rest` is empty, insert the node to `index`
        if (rest.length === 0) {
            assert_1.default(0 <= index && index <= cs.length, "[template] cannot insert the node to '" +
                path.join('->') +
                "' as the last index is out of possible range: " +
                `0 <= ${index} <= ${cs.length}`);
            return utils_1.clone(parent, {
                children: [...cs.slice(0, index), el, ...cs.slice(index)]
            });
        }
        const child = parent.children[index];
        assert_1.default(child, "[template] cannot reach to the path '" +
            path.join('->') +
            "' as there is no node on the way");
        assert_1.default(child.type === 'Element', "[template] cannot reach to the path '" +
            path.join('->') +
            "' as there is text or expression node on the way");
        const [head, ...tail] = rest;
        return utils_1.clone(parent, {
            children: [
                ...cs.slice(0, index),
                loop(child, head, tail),
                ...cs.slice(index + 1)
            ]
        });
    }
    return loop(root, path[0], path.slice(1));
}
exports.insertNode = insertNode;
function visitElements(node, fn) {
    function loop(node) {
        switch (node.type) {
            case 'Element':
                const newNode = utils_1.clone(node, {
                    children: node.children.map(loop)
                });
                return fn(newNode) || newNode;
            default:
                // Do nothing
                return node;
        }
    }
    return utils_1.clone(node, {
        children: node.children.map(loop)
    });
}
exports.visitElements = visitElements;
function resolveAsset(template, baseUrl, resolver) {
    return visitElements(template, el => {
        const src = el.startTag.attrs.src;
        if (el.name === 'img' && src && src.value) {
            const resolvedSrc = utils_1.clone(src, {
                value: resolver.pathToUrl(src.value, baseUrl)
            });
            return utils_1.clone(el, {
                startTag: utils_1.clone(el.startTag, {
                    attrs: utils_1.clone(el.startTag.attrs, {
                        src: resolvedSrc
                    })
                })
            });
        }
    });
}
exports.resolveAsset = resolveAsset;
function addScope(node, scope) {
    const scopeName = manipulate_1.scopePrefix + scope;
    return visitElements(node, el => {
        return utils_1.clone(el, {
            startTag: utils_1.clone(el.startTag, {
                attrs: utils_1.clone(el.startTag.attrs, {
                    [scopeName]: {
                        type: 'Attribute',
                        attrIndex: -1,
                        name: scopeName,
                        range: [-1, -1]
                    }
                })
            })
        });
    });
}
exports.addScope = addScope;
