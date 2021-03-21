"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.empty = insertAt(0, '');
exports.singleIndentStr = '  ';
function modify(code, modfiers) {
    const ms = utils_1.flatten(modfiers).sort(modifierComperator);
    function loop(acc, pos, cur, rest) {
        if (!cur) {
            return acc + code.slice(pos);
        }
        // Fix the current position to resolve overwraps of nodes.
        // e.g.
        //  remove: [4, 8] -> insert: 6
        //  then insert position will be 8.
        const fixedPos = pos <= cur.pos ? cur.pos : pos;
        const pre = code.slice(pos, fixedPos);
        switch (cur.type) {
            case 'Add':
                return loop(acc + pre + cur.value, fixedPos, rest[0], rest.slice(1));
            case 'Remove':
                const endPos = cur.pos + cur.length;
                const fixedEnd = pos <= endPos ? endPos : pos;
                return loop(acc + pre, fixedEnd, rest[0], rest.slice(1));
            default:
                throw new Error('[modifier] Unexpected modifier type: ' + cur.type);
        }
    }
    return loop('', 0, ms[0], ms.slice(1));
}
exports.modify = modify;
function reduce(modifiers, fn, initial) {
    const ms = utils_1.flatten(modifiers).sort(modifierComperator);
    return ms.reduce(fn, initial);
}
exports.reduce = reduce;
function modifierComperator(a, b) {
    if (a.pos < b.pos) {
        return -1;
    }
    else if (a.pos > b.pos) {
        return 1;
    }
    else {
        return 0;
    }
}
function insertAt(pos, value) {
    return {
        type: 'Add',
        pos,
        value
    };
}
exports.insertAt = insertAt;
function insertBefore(node, value) {
    return insertAt(node.range[0], value);
}
exports.insertBefore = insertBefore;
function insertAfter(node, value) {
    return insertAt(node.range[1], value);
}
exports.insertAfter = insertAfter;
function removeRange(from, to) {
    return {
        type: 'Remove',
        pos: from,
        length: to - from
    };
}
exports.removeRange = removeRange;
function remove(node) {
    return removeRange(node.range[0], node.range[1]);
}
exports.remove = remove;
function replace(node, value) {
    return [remove(node), insertAfter(node, value)];
}
exports.replace = replace;
