"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function executeOnEditor(editor, command) {
    editor.edit(editBuilder => {
        let selections = editor.selections;
        for (let index = 0; index < selections.length; index++) {
            const selection = selections[index];
            editBuilder.insert(selection.active, command.execute());
        }
    });
}
exports.executeOnEditor = executeOnEditor;
//# sourceMappingURL=editor.inserter.js.map