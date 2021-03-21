"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberIndexingCommand {
    constructor(editor, startIndex, increment) {
        this.editor = editor;
        this.startIndex = startIndex;
        this.increment = increment;
    }
    execute() {
        this.editor.edit(editBuilder => {
            let selections = this.editor.selections;
            for (let index = 0; index < selections.length; index++) {
                const selection = selections[index];
                editBuilder.insert(selection.active, this.startIndex.toString());
                this.startIndex += this.increment;
            }
        });
    }
}
exports.NumberIndexingCommand = NumberIndexingCommand;
//# sourceMappingURL=command.number.indexing.js.map