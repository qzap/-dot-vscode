'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when vs code is activated
function activate(context) {
    console.log('highlight-bad-chars decorator is activated');
    const badCharDecorationStyle = vscode.workspace.getConfiguration('highlight-bad-chars').badCharDecorationStyle;
    const badCharDecorationType = vscode.window.createTextEditorDecorationType(badCharDecorationStyle);
    const chars = [
        // https://github.com/possan/sublime_unicode_nbsp/blob/master/sublime_unicode_nbsp.py
        '\x82',
        '\x84',
        '\x85',
        '\x88',
        '\x91',
        '\x92',
        '\x93',
        '\x94',
        '\x95',
        '\x96',
        '\x97',
        '\x99',
        '\xA0',
        '\xA6',
        '\xAB',
        '\xBB',
        '\xBC',
        '\xBD',
        '\xBE',
        '\xBF',
        '\xA8',
        '\xB1',
        // https://www.cs.tut.fi/~jkorpela/chars/spaces.html
        // '\u00A0', // no-break space
        '\u1680',
        '\u180E',
        '\u2000',
        '\u2001',
        '\u2002',
        '\u2003',
        '\u2004',
        '\u2005',
        '\u2006',
        '\u2007',
        '\u2008',
        '\u2009',
        '\u200A',
        '\u200B',
        '\u200D',
        '\u2013',
        '\u2014',
        '\u2028',
        '\u202F',
        '\u205F',
        '\u3000',
        '\uFEFF',
        // others
        '\u037E',
        '\u0000',
        '\u0011',
        '\u0012',
        '\u0013',
        '\u0014',
        '\u001B',
        '\u0080',
        '\u0090',
        '\u009B',
        '\u009F',
        '\u00B8',
        '\u01C0',
        '\u2223',
    ];
    let additionalChars = vscode.workspace.getConfiguration('highlight-bad-chars').additionalUnicodeChars;
    let charRegExp = '[' + chars.join('') + additionalChars.join('') + ']';
    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    var timeout = null;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        let regEx = new RegExp(charRegExp, 'g');
        const text = activeEditor.document.getText();
        const badChars = [];
        let match;
        while (match = regEx.exec(text)) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Bad char "**' + match[0] + '**"' };
            badChars.push(decoration);
        }
        activeEditor.setDecorations(badCharDecorationType, badChars);
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map