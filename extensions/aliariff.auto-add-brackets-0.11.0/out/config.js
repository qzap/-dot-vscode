"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function Config() {
    const languages = vscode_1.workspace.getConfiguration('auto').get('languages', {});
    return {
        languages: languages,
    };
}
exports.default = Config();
//# sourceMappingURL=config.js.map