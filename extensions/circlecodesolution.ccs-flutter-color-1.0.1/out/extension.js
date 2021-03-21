"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const FlutterColorShow_1 = require("./FlutterColorShow");
const AllColorShow_1 = require("./AllColorShow");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let docFlutterSelector = {
        pattern: "**/*.dart"
    };
    // Register our CodeLens provider
    let FlutterColorShowDisposable = vscode.languages.registerColorProvider(docFlutterSelector, new FlutterColorShow_1.default());
    let allFileSelector = {
        pattern: "**/*",
    };
    // Register our CodeLens provider
    let AllColorShowDisposable = vscode.languages.registerColorProvider(allFileSelector, new AllColorShow_1.default());
    context.subscriptions.push(FlutterColorShowDisposable);
    context.subscriptions.push(AllColorShowDisposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map