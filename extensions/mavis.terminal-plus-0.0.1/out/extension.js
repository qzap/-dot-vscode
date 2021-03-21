"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const logger_1 = require("./utils/logger");
const path_1 = require("path");
const fs_1 = require("fs");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const log = new logger_1.Logger("terminal-plus");
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    log.info(`Extension has been activated`);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('term-plus.openTerminalHere', () => {
        var _a;
        let currentFilePath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.fileName;
        if (currentFilePath && fs_1.existsSync(currentFilePath)) {
            const px = path_1.resolve(currentFilePath, '..');
            log.debug(px);
            vscode.window.createTerminal({
                cwd: px
            }).show();
        }
        else {
            vscode.window.showErrorMessage(`Path could not be resolved for "${currentFilePath}"`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map