"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function default_1(terminal) {
    if (vscode_1.window.activeTerminal) {
        vscode_1.window.activeTerminal.show();
        return vscode_1.window.activeTerminal;
    }
    terminal.show();
    return terminal;
}
exports.default = default_1;
//# sourceMappingURL=getActiveTerminal.js.map