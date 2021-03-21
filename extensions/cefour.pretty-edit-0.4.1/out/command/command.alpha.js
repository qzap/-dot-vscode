"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlphaCommand {
    constructor(alpha) {
        this.alpha = alpha;
        this.words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.index = this.words.indexOf(this.alpha);
    }
    execute() {
        let result = this.words[this.index];
        this.index++;
        if (this.index >= this.words.length) {
            this.index = 0;
        }
        return result;
    }
}
exports.AlphaCommand = AlphaCommand;
//# sourceMappingURL=command.alpha.js.map