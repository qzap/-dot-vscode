"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provide = void 0;
const vscode = require("vscode");
const hexpm = require("./hexpm");
const semver = require('semver');
function provide(document, position) {
    const line = document.lineAt(position.line);
    const packageName = getPackageName(line, position);
    if (!packageName) {
        return Promise.resolve([]);
    }
    return getVersionsForPackage(packageName);
}
exports.provide = provide;
function getVersionsForPackage(packageName) {
    return hexpm.getPackage(packageName)
        .then(res => completionItemsForReleases(res.releases))
        .then(sortCompletionItems)
        .catch(error => {
        if (error.response.status === 404) {
            return [];
        }
        throw error;
    });
}
function getPackageName(line, position) {
    const tupleIndex = tupleBeginIndex(line, position);
    const text = line.text.trim().substr(tupleIndex);
    const regex = /:[a-zA-Z_]+/;
    const atoms = text.match(regex) || [''];
    const lastAtom = atoms[atoms.length - 1];
    const packageName = lastAtom.replace(/^:/, '');
    return packageName;
}
function tupleBeginIndex(line, position) {
    const text = line.text.trim();
    const left = text.substr(0, position.character);
    const tupleBeginIndex = left.lastIndexOf('{');
    return tupleBeginIndex;
}
function sortCompletionItems(completionItems) {
    // descending sort using semver: most recent version first
    const sorted = completionItems.sort((a, b) => semver.rcompare(a.label, b.label));
    // comply with js lexicographic sorting as vscode does not allow alternative sorting
    // maintain sort using 0-9 prefixed with z for each place value
    sorted.forEach((item, idx) => item.sortText = `${'z'.repeat(Math.trunc(idx / 10))}${idx % 10}`);
    return sorted;
}
function completionItemsForReleases(releases) {
    return releases.map((rel, index, arr) => {
        const completionItem = new vscode.CompletionItem(rel.version, vscode.CompletionItemKind.Property);
        return completionItem;
    });
}
//# sourceMappingURL=provide.js.map