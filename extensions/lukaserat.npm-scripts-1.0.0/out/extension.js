'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const lodash_1 = require("lodash");
const fs_1 = require("fs");
const path = require("path");
const { window, workspace } = vscode;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    const rootDir = lodash_1.first(workspace.workspaceFolders || []);
    // NPM Script instance
    let npmScript = new NpmScripts();
    // Get npm scripts from package.json
    if (rootDir) {
        npmScript.read(path.join(rootDir.uri.path, 'package.json'))
            .updateStatusBar();
        let disposable = vscode.commands.registerCommand('extension.npmScripts', () => {
            window.showQuickPick(npmScript.scripts(), {
                placeHolder: 'Select npm script to run...'
            }).then(npmScript.run.bind(npmScript));
        });
        context.subscriptions.push(workspace.onDidCloseTextDocument(npmScript.watcher.bind(npmScript)));
        context.subscriptions.push(workspace.onDidChangeTextDocument(npmScript.watcher.bind(npmScript)));
        context.subscriptions.push(disposable);
    }
    context.subscriptions.push(npmScript);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class NpmScripts {
    constructor() {
        this._statusBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this._terminal = [];
        this._content = { scripts: {} };
        this._scripts = [];
        this._path = '';
        this._execId = 0;
        this._statusBarItem.command = 'extension.npmScripts';
    }
    run(command) {
        if (command) {
            const terminal = window.createTerminal();
            terminal.show();
            terminal.sendText(`npm run ${command}`, true);
            this._terminal.push(terminal);
        }
    }
    scripts() {
        return this._scripts.map((item) => item.name);
    }
    watcher(subject) {
        if (this._execId) {
            clearTimeout(this._execId);
        }
        this._execId = setTimeout(() => {
            let update = false;
            if (subject) {
                if (subject.fileName
                    && subject.fileName.indexOf('package.json') >= 0) {
                    update = true;
                }
                else {
                    const document = subject.document;
                    if (document && document.fileName.indexOf('package.json') >= 0) {
                        update = true;
                    }
                }
            }
            if (update) {
                this.read(undefined).updateStatusBar();
            }
        }, 10);
    }
    read(packageJsonPath) {
        if (packageJsonPath) {
            this._path = packageJsonPath;
        }
        this._content = JSON.parse(fs_1.readFileSync(this._path, 'utf8'));
        this._scripts = [];
        lodash_1.forOwn(this._content.scripts, (command, name) => {
            this._scripts.push({ command, name });
        });
        return this;
    }
    updateStatusBar() {
        if (this._scripts.length > 0) {
            this._statusBarItem.text = `npm scripts[${this._scripts.length}]`;
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }
    dispose() {
        this._statusBarItem.dispose();
        this._terminal.forEach(terminal => terminal.dispose());
    }
}
//# sourceMappingURL=extension.js.map