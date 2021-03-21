"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUri_1 = require("../libs/getUri");
const fs = require("fs");
const getActiveTerminal_1 = require("../libs/getActiveTerminal");
function default_1(terminal, outputChannel) {
    const { workspace } = getUri_1.default();
    const actvieTerminal = getActiveTerminal_1.default(terminal);
    try {
        const vsix = fs.readdirSync(workspace).filter(item => item.endsWith('.vsix'));
        outputChannel.append(`vsix: ${JSON.stringify(vsix)}\n`);
        if (vsix.length) {
            actvieTerminal.sendText(`code --install-extension ${vsix[vsix.length - 1]}`);
        }
        else {
            outputChannel.show();
        }
    }
    catch (e) {
        outputChannel.append(`Install vsix error: ${String(e)}\n`);
        outputChannel.show();
    }
}
exports.default = default_1;
//# sourceMappingURL=installExtension.js.map