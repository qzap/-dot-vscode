"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomNumberCommand {
    constructor(radomizer, beginInt = -1, endInt = -1) {
        this.radomizer = radomizer;
        this.beginInt = beginInt;
        this.endInt = endInt;
    }
    execute() {
        if (this.beginInt === -1 && this.endInt === -1) {
            let value = Math.random();
            return value.toString();
        }
        else {
            return this.radomizer.generateRandInteger(this.beginInt, this.endInt).toString();
        }
    }
}
exports.RandomNumberCommand = RandomNumberCommand;
//# sourceMappingURL=command.number.random.js.map