"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Randomizer {
    constructor() { }
    generateRandInteger(beginInterval, endInterval) {
        let min = Math.ceil(beginInterval);
        let max = Math.floor(endInterval);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    generateRandFloat(beginInterval, endInterval) {
        return 0.0;
    }
}
exports.Randomizer = Randomizer;
//# sourceMappingURL=randomizer.js.map