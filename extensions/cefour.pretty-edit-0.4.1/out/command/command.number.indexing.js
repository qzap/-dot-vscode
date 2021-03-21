"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NumberIndexingCommand {
    constructor(startIndex, increment) {
        this.startIndex = startIndex;
        this.increment = increment;
    }
    execute() {
        let result = this.startIndex.toString();
        this.startIndex += this.increment;
        return result;
    }
}
exports.NumberIndexingCommand = NumberIndexingCommand;
//# sourceMappingURL=command.number.indexing.js.map