'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const stripComments = require("strip-json-comments");
const parse = require('json-to-ast');
const LINE_SEPERATOR = /\n|\r\n/;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "json-pretty-printer" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.prettyPrint', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const editor_config = vscode.workspace.getConfiguration('editor');
        const tab_size = editor_config.get('tabSize', 4);
        const isSpace = editor_config.get('insertSpace', false);
        let tab_type = 'tab';
        if (isSpace) {
            tab_type = 'space';
        }
        const raw = stripComments(editor.document.getText());
        prettyPrint(raw, getTab(tab_type, tab_size)).then((content) => {
            return editor.edit(builder => {
                const start = new vscode.Position(0, 0);
                const lines = raw.split(LINE_SEPERATOR);
                const end = new vscode.Position(lines.length, lines[lines.length - 1].length);
                const allRange = new vscode.Range(start, end);
                builder.replace(allRange, content);
            });
        }).then(success => {
            console.log('finished');
            //@TODO: unselect text
        }).catch(reason => {
            console.error(reason);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function visitor(ast, tab, indent) {
    let data = '';
    switch (ast.type) {
        case 'Object':
            data += '{\n';
            if (ast.hasOwnProperty('children')) {
                let items = [];
                ast.children.forEach((child) => {
                    items.push(visitor(child, tab, indent + 1));
                });
                data += items.join(',\n') + '\n';
            }
            data += tab.repeat(indent) + '}';
            break;
        case 'Array':
            data += '[\n';
            if (ast.hasOwnProperty('children')) {
                let items = [];
                ast.children.forEach((child) => {
                    items.push(tab.repeat(indent + 1) + visitor(child, tab, indent + 1));
                });
                data += items.join(',\n') + '\n';
            }
            data += tab.repeat(indent) + ']';
            break;
        case 'Property':
            data += tab.repeat(indent) + ast.key.raw + ': ' + visitor(ast.value, tab, indent);
            break;
        case 'Literal':
            data += ast.raw;
            break;
        default:
            break;
    }
    return data;
}
function prettyPrint(data, tab) {
    return new Promise((resolve, reject) => {
        let ast = parse(data, {
            loc: false
        });
        resolve(visitor(ast, tab, 0) + '\n');
    });
}
exports.prettyPrint = prettyPrint;
function getTab(tabStyle, tabSize) {
    if (tabStyle === 'space') {
        return ' '.repeat(tabSize);
    }
    return '\t';
}
exports.getTab = getTab;
//# sourceMappingURL=extension.js.map