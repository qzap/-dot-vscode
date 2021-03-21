"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomNumberCommand {
    constructor(editor, beginInt = -1, endInt = -1) {
        this.editor = editor;
        this.beginInt = beginInt;
        this.endInt = endInt;
    }
    getRandomNumberInIntervall() {
        let min = Math.ceil(this.beginInt);
        let max = Math.floor(this.endInt);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    execute() {
        this.editor.edit(editBuilder => {
            let selections = this.editor.selections;
            for (let index = 0; index < selections.length; index++) {
                const selection = selections[index];
                let value = Math.random();
                if (this.beginInt === -1 && this.endInt === -1) {
                    editBuilder.insert(selection.active, value.toString());
                }
                else {
                    editBuilder.insert(selection.active, this.getRandomNumberInIntervall().toString());
                }
            }
        });
    }
}
exports.RandomNumberCommand = RandomNumberCommand;
//# sourceMappingURL=command.number.random.js.map