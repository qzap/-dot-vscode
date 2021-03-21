'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.web-browse', () => {
        var extension = vscode.extensions.getExtension('auriou.webbrowse');
        if (extension !== undefined) {
            var extensionPath = extension.extensionPath;
            var pathHome = vscode.Uri.file(extensionPath + "/resources/home.html");
            vscode.commands.executeCommand('vscode.previewHtml', pathHome, vscode.ViewColumn.Two, 'Browser').then((success) => { }, (reason) => {
                vscode.window.showErrorMessage(reason);
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map