'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const HexCompletion_1 = require("./HexCompletion");
function activate(context) {
    const provider = new HexCompletion_1.HexCompletion();
    const selector = ["elixir", "Elixir"];
    const triggers = ['"', ' '];
    const hexCompletion = vscode.languages.registerCompletionItemProvider(selector, provider, ...triggers);
    context.subscriptions.push(hexCompletion);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map