"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manipulate_1 = require("./manipulate");
const modifier_1 = require("../modifier");
const codegen_1 = require("./codegen");
const utils_1 = require("../../utils");
function insertDeclaration(styles, decl, to) {
    const target = manipulate_1.getDeclaration(styles, to);
    if (target) {
        return modifier_1.insertBefore(target, codegen_1.genDeclaration(utils_1.clone(target, decl)) + target.before);
    }
    const parentPath = to.slice(0, -1);
    const last = to[to.length - 1];
    const before = manipulate_1.getDeclaration(styles, parentPath.concat(last - 1));
    if (before) {
        return modifier_1.insertAfter(before, before.before + codegen_1.genDeclaration(utils_1.clone(before, decl)));
    }
    const rule = manipulate_1.getNode(styles, parentPath);
    if (rule && rule.type === 'Rule') {
        const d = Object.assign({ type: 'Declaration', path: to, before: '', after: '', range: [-1, -1] }, decl);
        const inserted = utils_1.clone(rule, {
            children: [
                ...rule.children.slice(last),
                d,
                ...rule.children.slice(last + 1)
            ]
        });
        return modifier_1.replace(rule, codegen_1.genRule(inserted));
    }
    return modifier_1.empty;
}
exports.insertDeclaration = insertDeclaration;
function removeDeclaration(styles, path) {
    const target = manipulate_1.getDeclaration(styles, path);
    return target
        ? modifier_1.removeRange(target.range[0] - target.before.length, target.range[1])
        : modifier_1.empty;
}
exports.removeDeclaration = removeDeclaration;
function updateDeclaration(styles, decl) {
    const target = manipulate_1.getDeclaration(styles, decl.path);
    return target ? modifier_1.replace(target, codegen_1.genDeclaration(utils_1.clone(target, decl))) : [modifier_1.empty];
}
exports.updateDeclaration = updateDeclaration;
