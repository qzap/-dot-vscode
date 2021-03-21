"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const stripComments = require("strip-json-comments");
const prettyCompact = require("json-stringify-pretty-compact");
const jsonlint = require("jsonlint");
const LINE_SEPERATOR = /\n|\r\n/;
// TODO: make this configurable.
const JSON_SPACE = 4;
function activate(context) {
    const disposable = vscode_1.commands.registerCommand('extension.prettifyCompact', () => {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor)
            return;
        const editorConfig = vscode_1.workspace.getConfiguration('editor');
        const tabSize = editorConfig.get('tabSize', JSON_SPACE);
        const raw = editor.document.getText();
        let json = null;
        try {
            json = jsonlint.parse(stripComments(raw));
        }
        catch ({ message }) {
            const lineNumber = parseInt(message.substring(message.indexOf('line ') + 5, message.indexOf(':')), 10);
            console.error(`Line ${lineNumber}: ${message}`);
            return;
        }
        const pretty = prettyCompact(json, {
            indent: tabSize,
            maxLength: 200,
        });
        editor.edit((builder) => {
            const start = new vscode_1.Position(0, 0);
            const lines = raw.split(LINE_SEPERATOR);
            const end = new vscode_1.Position(lines.length, lines[lines.length - 1].length);
            const allRange = new vscode_1.Range(start, end);
            builder.replace(allRange, pretty);
        }).then(() => {
            // TODO: unselect the text
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map