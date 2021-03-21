"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextDecorationCollection {
    constructor(generateUuid) {
        this.generateUuid = generateUuid;
        this.map = new Map();
    }
    add(pattern, colour, decorationType) {
        const id = this.generateUuid();
        const decoration = { id, pattern, colour, decorationType };
        this.map.set(id, decoration);
        return decoration;
    }
    get(id) {
        return this.map.get(id);
    }
    remove(id) {
        this.map.delete(id);
    }
    find(predicate) {
        return Array.from(this.map.values())
            .find(decoration => predicate(decoration)) || null;
    }
    toList() {
        return Array.from(this.map.values())
            .reduce((result, decoration) => [...result, decoration], []);
    }
}
exports.default = TextDecorationCollection;
//# sourceMappingURL=text-decoration-collection.js.map