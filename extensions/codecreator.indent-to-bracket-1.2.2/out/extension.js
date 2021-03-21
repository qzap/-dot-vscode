'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Activated: indent-to-bracket');
    overrideCommand(context, "type", (args) => __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        if (editor !== undefined && (args.text === "\n" || args.text == "\r\n")) {
            yield insertNewLinesAndIndent(editor);
        }
        else {
            yield vscode.commands.executeCommand('default:type', args);
        }
    }));
}
exports.activate = activate;
// Method borrowed from vim vscode extension
function overrideCommand(context, command, callback) {
    const disposable = vscode.commands.registerCommand(command, (args) => __awaiter(this, void 0, void 0, function* () {
        // TODO: add way of disabling extension
        if (!vscode.window.activeTextEditor) {
            yield vscode.commands.executeCommand('default:' + command, args);
            return;
        }
        // Not precisely sure why this is important, but if the vim folk think that the behavior of this document
        // should remained unmodified, perhaps I should follow suit!
        if (vscode.window.activeTextEditor.document && vscode.window.activeTextEditor.document.uri.toString() === 'debug:input') {
            yield vscode.commands.executeCommand('default:' + command, args);
            return;
        }
        callback(args);
    }));
    context.subscriptions.push(disposable);
}
class BracketCounter {
    constructor() {
        this.tallies = { paren: 0, square: 0, curly: 0 };
    }
    static get kBracketKeys() {
        return { '(': 'paren', ')': 'paren', '[': 'square', ']': 'square',
            '{': 'curly', '}': 'curly' };
    }
    static keyForBracket(bracket) {
        return this.kBracketKeys[bracket];
    }
    addToTallyForBracket(bracket, amount) {
        this.tallies[BracketCounter.keyForBracket(bracket)] += amount;
    }
    bracketTallyForBracket(bracket) {
        return this.tallies[BracketCounter.keyForBracket(bracket)];
    }
    areAllBracketsClosed() {
        for (var key in this.tallies) {
            if (this.tallies.hasOwnProperty(key) && this.tallies[key] !== 0) {
                return false;
            }
        }
        return true;
    }
}
function isBracketPair(brackets) {
    return brackets === '()' || brackets === '[]' || brackets === '{}';
}
function isOpeningBracket(bracket) {
    return bracket === '(' || bracket === '[' || bracket === '{';
}
function isClosingBracket(bracket) {
    return bracket === ')' || bracket === ']' || bracket === '}';
}
function allBracketsInString(s) {
    var regex = /(\(|\)|\[|\]|{|})/g;
    var indices = new Array();
    var match = null;
    while (match = regex.exec(s)) {
        indices.push(match.index);
    }
    return indices;
}
function columnOfCharacterInLine(line, character, tabSize) {
    var result = 0;
    for (var i = 0; i < character; ++i) {
        if (line[i] == '\t') {
            result += tabSize;
        }
        else {
            result += 1;
        }
    }
    return result;
}
// Returns null if the given line doesn't indicate the point we want to indent to
function findIndentationPositionInLineAndTallyOpenBrackets(line, tallies, tabSize) {
    var indices = allBracketsInString(line);
    if (indices.length === 0) {
        return null;
    }
    for (var i = indices.length - 1; i >= 0; --i) {
        var index = indices[i];
        var char = line[index];
        if (isClosingBracket(char)) {
            tallies.addToTallyForBracket(char, 1);
        }
        else if (tallies.bracketTallyForBracket(char) == 0) {
            // An open bracket that has no matching closing bracket -- we want to indent to the column after it!
            return columnOfCharacterInLine(line, index, tabSize) + 1;
        }
        else {
            tallies.addToTallyForBracket(char, -1);
        }
    }
    return null;
}
function findIndentationPositionOfPreviousOpenBracket(editor, position) {
    var document = editor.document;
    var line_number = position.line;
    // Don't want to consider the entire line if the insertion point isn't at the end:
    var line = document.lineAt(line_number).text.substring(0, position.character);
    var tabSize = editor.options.tabSize;
    if (isOpeningBracket(line[line.length - 1])) {
        // We want to use the editor's default indentation in this case
        return null;
    }
    var tallies = new BracketCounter();
    for (var currentLineNumber = line_number; currentLineNumber >= 0; --currentLineNumber) {
        var currentLine = (currentLineNumber === line_number) ? line : document.lineAt(currentLineNumber).text;
        var indentationIndex = findIndentationPositionInLineAndTallyOpenBrackets(currentLine, tallies, tabSize);
        if (indentationIndex !== null) {
            return indentationIndex;
        }
        if (tallies.areAllBracketsClosed()) {
            if (currentLineNumber !== line_number) {
                return columnOfCharacterInLine(currentLine, document.lineAt(currentLineNumber).firstNonWhitespaceCharacterIndex, tabSize);
            }
            else {
                return null;
            }
        }
    }
    return null;
}
function findDefaultIndentationPosition(editor, position, checkOpeningBracket) {
    // Imitate vscode's default indentation behaviour.
    var line = editor.document.lineAt(position.line).text.substring(0, position.character);
    var indentation_index = Math.min(position.character, editor.document.lineAt(position.line).firstNonWhitespaceCharacterIndex);
    var tabSize = editor.options.tabSize;
    let indentation_position = columnOfCharacterInLine(line, indentation_index, tabSize);
    if (checkOpeningBracket && isOpeningBracket(editor.document.lineAt(position.line).text[line.length - 1])) {
        // We want to use the editor's default indentation in this case
        indentation_position += tabSize;
    }
    return indentation_position;
}
function findClosingBracketIndentationPosition(editor, selection) {
    let brackets = (editor.document.lineAt(selection.start.line).text[selection.start.character - 1] +
        editor.document.lineAt(selection.end.line).text[selection.end.character]);
    if (isBracketPair(brackets)) {
        return findDefaultIndentationPosition(editor, selection.start, false);
    }
    return -1;
}
function indentationWhitespaceToColumn(column, tabSize, insertSpaces) {
    if (insertSpaces) {
        return ' '.repeat(column);
    }
    else {
        return '\t'.repeat(column / tabSize) + ' '.repeat(column % tabSize);
    }
}
// Since TextEditor.edit returns a thenable but not a promise, this is a convenience function that calls
// TextEditor.edit and returns a proper promise, allowing for chaining
function editorEdit(editor, callback, options) {
    return new Promise((resolve, reject) => {
        editor.edit(callback, options).then((success) => {
            if (success) {
                resolve(true);
            }
            else {
                console.log('vscode-indent-to-bracket: Edit failed.');
                reject();
            }
        });
    });
}
function insertNewLinesAndIndent(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        // Sort indices first according to order in document.
        // This order doesn't change when newline and indentation are inserted.
        let sorted_indices = [...editor.selections.keys()];
        sorted_indices.sort((a, b) => {
            let line_delta = editor.selections[a].start.line - editor.selections[b].start.line;
            if (line_delta == 0) {
                return editor.selections[a].start.character - editor.selections[b].start.character;
            }
            else {
                return line_delta;
            }
        });
        // Write history.
        yield editorEdit(editor, (edit) => {
            edit.insert(editor.selection.active, '');
        }, { undoStopBefore: true, undoStopAfter: false });
        for (let i = 0; i < sorted_indices.length; ++i) {
            let selection = editor.selections[sorted_indices[i]];
            let closing_bracket_indentation_position = -1;
            let indentation_position = findIndentationPositionOfPreviousOpenBracket(editor, selection.start);
            if (indentation_position === null) {
                closing_bracket_indentation_position = findClosingBracketIndentationPosition(editor, selection);
                indentation_position = findDefaultIndentationPosition(editor, selection.start, true);
            }
            let whitespace = indentationWhitespaceToColumn(indentation_position, editor.options.tabSize, editor.options.insertSpaces);
            yield editorEdit(editor, (edit) => {
                if (!selection.isEmpty) {
                    edit.delete(selection);
                }
                edit.insert(selection.start, '\n' + whitespace);
            }, { undoStopBefore: false, undoStopAfter: false });
            if (closing_bracket_indentation_position >= 0) {
                whitespace = indentationWhitespaceToColumn(closing_bracket_indentation_position, editor.options.tabSize, editor.options.insertSpaces);
                let stored_selections = editor.selections;
                selection = editor.selections[sorted_indices[i]];
                yield editorEdit(editor, (edit) => {
                    edit.insert(selection.start, '\n' + whitespace);
                }, { undoStopBefore: false, undoStopAfter: false });
                editor.selections = stored_selections;
            }
        }
        // Write history.
        yield editorEdit(editor, (edit) => {
            edit.insert(editor.selection.active, '');
        }, { undoStopBefore: false, undoStopAfter: true });
    });
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map