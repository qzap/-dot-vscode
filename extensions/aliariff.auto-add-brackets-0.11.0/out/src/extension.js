"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const config_1 = require("./config");
function isInsideString(editor, stringWrapper, selection) {
    const lineText = editor.document.getText(new vscode_1.Range(new vscode_1.Position(selection.start.line, 0), selection.start));
    let occurrences = lineText.split(stringWrapper).length - 1;
    const escaped = lineText.split(`\\${stringWrapper}`).length - 1;
    // ignore escaped character
    // example: "abc \" xyz"
    occurrences -= escaped;
    // if the occurrences of the indicator (", `) is odd then it is inside a string
    // example: some code, "string without interpolation", 'another simple string', "#{string} with interpolation"
    return occurrences % 2;
}
function shouldInterpolate(editor, language, selection) {
    if (selection === undefined) {
        selection = editor.selection;
    }
    return (isInsideString(editor, language.stringWrapper, selection) &&
        selection.isSingleLine);
}
// updateSelections moves the selections to the expected place after adding interpolation.
// It makes it behave the same way other wrapping operations do in VSCode
function updateSelections(editor) {
    const updatedSelections = [];
    editor.selections.forEach(selection => {
        // If selection is empty we either did not add an interpolation
        // or we added it without having anything selected
        if (selection.isEmpty) {
            const characterBeforeCursor = editor.document.getText(new vscode_1.Range(selection.start, selection.end.translate(0, -1)));
            // If the characterBeforeCursor is a '}' it means that we did add a
            // interpolation, so we want to move one character back to position
            // the cursor in the middle of it.
            if (characterBeforeCursor === '}') {
                const newPosition = selection.start.translate(0, -1);
                updatedSelections.push(new vscode_1.Selection(newPosition, newPosition));
            }
            else {
                // Otherwise we did not add an interpolation, so we just don't change
                // anything
                updatedSelections.push(selection);
            }
        }
        else {
            // In this case we added a interpolation with stuff selected, so let's
            // position the selection properly
            updatedSelections.push(new vscode_1.Selection(selection.start, selection.end.translate(0, -1)));
        }
    });
    editor.selections = updatedSelections;
}
function autoAddInterpolation() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode_1.window.activeTextEditor;
        if (editor === undefined) {
            return;
        }
        const language = config_1.default.languages[editor.document.languageId];
        yield editor.edit(editBuilder => {
            editor.selections.forEach(selection => {
                if (shouldInterpolate(editor, language, selection)) {
                    editBuilder.insert(selection.start, `${language.symbol}{`);
                    editBuilder.insert(selection.end, '}');
                }
                else {
                    // Just passthrough and insert the symbol as if the extension did not even exist
                    editBuilder.insert(selection.start, language.symbol);
                }
            });
        });
        updateSelections(editor);
    });
}
function activate(context) {
    console.log('"auto-add-brackets" extension is now active!');
    context.subscriptions.push(vscode_1.commands.registerCommand('auto.addInterpolation', () => {
        autoAddInterpolation();
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map