"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const getActiveTerminal_1 = require("../libs/getActiveTerminal");
const util_1 = require("util");
/**
 * @classdesc treeView item handlers
 */
class Selection {
    constructor(terminal) {
        this.terminal = terminal;
    }
    /**
     * @desc install selected dependance
     */
    install(item, location = '', remove = '') {
        const terminal = getActiveTerminal_1.default(this.terminal);
        const config = vscode_1.workspace.getConfiguration('terminal-tools').get('options');
        const sudo = config.sudo ? 'sudo ' : '';
        let options = '';
        if (!remove && util_1.isArray(config.installOptions) && config.installOptions.length) {
            config.installOptions.forEach((item) => {
                options += ` ${item}`;
            });
        }
        if (!item) {
            return;
        }
        return terminal.sendText(`${sudo}${config.install} ${remove}install ${location} ${item && item.label}${options}`);
    }
}
exports.default = Selection;
//# sourceMappingURL=Selection.js.map