'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode_1.commands.registerCommand('indent-line.indentLine', indentLine);
    context.subscriptions.push(disposable);
    disposable = vscode_1.commands.registerCommand('indent-line.indentLineNextLine', indentLine.bind(null, false));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function indentLine(stayOnLine = true) {
    const activeEditor = vscode_1.window.activeTextEditor;
    vscode_1.commands.executeCommand("cursorUp")
        .then(() => { return vscode_1.commands.executeCommand("expandLineSelection"); })
        .then(() => { return vscode_1.commands.executeCommand("expandLineSelection"); })
        .then(() => { return vscode_1.commands.executeCommand("editor.action.formatSelection"); })
        .then(() => {
        activeEditor.selection = new vscode_1.Selection(activeEditor.selection.end, activeEditor.selection.end);
        if (stayOnLine) {
            vscode_1.commands.executeCommand("cursorUp");
        }
    });
}
//# sourceMappingURL=extension.js.map