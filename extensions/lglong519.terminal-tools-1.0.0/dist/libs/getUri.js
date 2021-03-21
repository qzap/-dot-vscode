"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
/**
 *
 * @return {Output}
 * 原始:"file:///f%3A/webData/git/layouts"
 * decode:"file:///f:/webData/git/layouts"
 {"workspace":"/home/glenn/Documents/Glenn/git/test","filePath":"","fullPath":"","path":"","file":""}
 {
     "workspace":"/home/glenn/Documents/Glenn/git/test",
     "filePath":"/src/index.js",
     "fullPath":"/home/glenn/Documents/Glenn/git/test/src/index.js",
     "path":"/home/glenn/Documents/Glenn/git/test/src",
     "file":"index.js"
 }
 */
function default_1() {
    let workspaceFolders = vscode.workspace.workspaceFolders || [], system = 'linux', workspace = '', filePath = '', fullPath = '', path = '', file = '';
    const sys = {
        system
    };
    if (workspaceFolders.length) {
        workspace = decodeURIComponent(workspaceFolders[0].uri.toString());
    }
    if (vscode.window.activeTextEditor) {
        filePath = decodeURIComponent(vscode.window.activeTextEditor.document.uri.toString());
        fullPath = filterStrForSys(filePath);
        path = fullPath.slice(0, fullPath.lastIndexOf('/'));
        file = fullPath.split('/').reverse()[0];
        filePath = filePath.replace(workspace, '');
    }
    workspace = filterStrForSys(workspace, sys);
    return {
        system: sys.system,
        workspace,
        filePath,
        fullPath,
        path,
        file
    };
}
exports.default = default_1;
function filterStrForSys(str, sys) {
    if ((/file:\/\/\/[a-z]:\//i).test(str)) {
        if (sys) {
            sys.system = 'windows';
        }
        return str.replace('file:///', '');
    }
    return str.replace('file://', '');
}
//# sourceMappingURL=getUri.js.map