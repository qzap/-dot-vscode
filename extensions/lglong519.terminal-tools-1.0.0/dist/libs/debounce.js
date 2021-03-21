"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(func, wait) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, wait);
    };
}
exports.default = default_1;
//# sourceMappingURL=debounce.js.map