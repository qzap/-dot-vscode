"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint no-unused-var:1 */
const vscode = require("vscode");
class ListItem extends vscode.TreeItem {
    constructor(label, collapsibleState, contextValue = 'terminalTools', command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.contextValue = contextValue;
        this.command = command;
    }
}
exports.default = ListItem;
//# sourceMappingURL=ListItem.js.map