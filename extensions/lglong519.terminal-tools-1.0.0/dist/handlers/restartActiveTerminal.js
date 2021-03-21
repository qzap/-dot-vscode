"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const getActiveTerminal_1 = require("../libs/getActiveTerminal");
function default_1(terminal, terminalStatus) {
    return () => {
        terminal = getActiveTerminal_1.default(terminal);
        if (terminal.name == 'terminal-tools') {
            terminalStatus.dispose = true;
        }
        else {
            terminal.dispose();
            vscode.window.createTerminal().show();
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=restartActiveTerminal.js.map