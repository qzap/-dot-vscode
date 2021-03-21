'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    vscode.workspace.onDidChangeTextDocument((event) => {
        preventBracketsDuplication(event);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function preventBracketsDuplication(event) {
    let chars = ['(', ')', '{', '}', '<', '>', '[', ']', ':', ';', '\'', '"'], editor = vscode.window.activeTextEditor, curPos = editor.selection.active, curChar = editor.document.getText(new vscode.Range(curPos, curPos.translate(0, 1)));
    if (chars.indexOf(curChar) == -1) {
        return;
    }
    let nextChar = editor.document.getText(new vscode.Range(curPos.translate(0, 1), curPos.translate(0, 2)));
    ;
    if (curChar == nextChar) {
        editor.edit((editBuilder) => {
            editBuilder.delete(new vscode.Range(curPos.translate(0, 1), curPos.translate(0, 2)));
        });
    }
}
//# sourceMappingURL=extension.js.map