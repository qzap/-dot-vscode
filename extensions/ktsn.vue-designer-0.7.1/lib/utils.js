"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapValues(record, fn) {
    const res = {};
    Object.keys(record).forEach(key => {
        res[key] = fn(record[key], key);
    });
    return res;
}
exports.mapValues = mapValues;
function takeWhile(list, fn) {
    const res = [];
    for (const item of list) {
        if (fn(item)) {
            res.push(item);
        }
        else {
            return res;
        }
    }
    return res;
}
exports.takeWhile = takeWhile;
function dropWhile(list, fn) {
    const skip = takeWhile(list, fn);
    return list.slice(skip.length);
}
exports.dropWhile = dropWhile;
function flatten(list) {
    return list.reduce((acc, item) => {
        return acc.concat(item);
    }, []);
}
exports.flatten = flatten;
function clone(value, changes = {}) {
    return Object.assign({}, value, changes);
}
exports.clone = clone;
function range(min, max) {
    return Array.apply(null, Array(max - min + 1)).map((_, i) => min + i);
}
exports.range = range;
function minmax(min, n, max) {
    return Math.min(max, Math.max(min, n));
}
exports.minmax = minmax;
function isObject(value) {
    return value !== null && typeof value === 'object';
}
exports.isObject = isObject;
function unquote(str) {
    const quotes = str[0] + str[str.length - 1];
    if (quotes === "''" || quotes === '""') {
        return str.slice(1, -1);
    }
    else {
        return str;
    }
}
exports.unquote = unquote;
