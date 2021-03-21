"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_empty_1 = require("./command/command.empty");
const command_number_indexing_1 = require("./command/command.number.indexing");
const command_number_random_1 = require("./command/command.number.random");
const editor_inserter_1 = require("./gui/editor.inserter");
const randomizer_1 = require("./util/randomizer");
const command_alpha_1 = require("./command/command.alpha");
class CommandBuilder {
    constructor(cmd) {
        this.cmd = cmd;
    }
    testIsDigit(digit) {
        if (parseInt(digit.trim())) {
            return true;
        }
        return false;
    }
    testIsLetter(alpha) {
        let ch = alpha.trim();
        return ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
    }
    build(editor) {
        var _a;
        let call = new command_empty_1.EmptyCommand("");
        const command = (_a = this.cmd) === null || _a === void 0 ? void 0 : _a.split(";");
        if (command) {
            editor_inserter_1.executeOnEditor(editor, this.chooseCommand(command));
        }
    }
    chooseCommand(command) {
        if (command.length > 0) {
            for (let i = 0; i < command.length; ++i) {
                command[i] = command[i].trim();
            }
            if (this.testIsDigit(command[0])) {
                if (command.length > 1 && this.testIsDigit(command[1])) {
                    return new command_number_indexing_1.NumberIndexingCommand(+command[0], +command[1]);
                }
                return new command_number_indexing_1.NumberIndexingCommand(+command[0], 1);
            }
            else if (command[0] === 'rand') {
                if (command.length > 2 && this.testIsDigit(command[1]) && this.testIsDigit(command[2])) {
                    return new command_number_random_1.RandomNumberCommand(new randomizer_1.Randomizer(), +command[1], +command[2]);
                }
                return new command_number_random_1.RandomNumberCommand(new randomizer_1.Randomizer());
            }
            else if (command[0] === 'alpha') {
                if (command.length > 1 && this.testIsLetter(command[1])) {
                    return new command_alpha_1.AlphaCommand(command[1]);
                }
            }
        }
        return new command_empty_1.EmptyCommand("");
    }
}
exports.CommandBuilder = CommandBuilder;
//# sourceMappingURL=command.builder.js.map