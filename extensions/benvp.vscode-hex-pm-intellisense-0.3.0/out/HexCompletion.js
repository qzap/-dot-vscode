"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexCompletion = void 0;
const shouldProvide_1 = require("./shouldProvide");
const provide_1 = require("./provide");
class HexCompletion {
    provideCompletionItems(document, position) {
        return shouldProvide_1.shouldProvide(document, position) ? provide_1.provide(document, position) : Promise.resolve([]);
    }
}
exports.HexCompletion = HexCompletion;
//# sourceMappingURL=HexCompletion.js.map