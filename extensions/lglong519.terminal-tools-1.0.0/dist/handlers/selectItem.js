"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const getActiveTerminal_1 = require("../libs/getActiveTerminal");
const models_1 = require("../models");
function default_1(terminal, outputChannel) {
    vscode.window.showQuickPick(models_1.default().directives).then(selected => {
        const actvieTerminal = getActiveTerminal_1.default(terminal);
        if (selected) {
            actvieTerminal.show();
            outputChannel.append(`Item '${selected}' has been selected!\n`);
            actvieTerminal.sendText(selected);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=selectItem.js.map