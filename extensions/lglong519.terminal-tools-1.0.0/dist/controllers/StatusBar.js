"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class StatusBar {
    constructor(statusBarItems) {
        this.statusBarItems = statusBarItems;
    }
    addItem(text, cmd, tip, col) {
        this.statusBarItems.push(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)); // Left Right
        this.statusBarItems[this.statusBarItems.length - 1].text = text;
        if (cmd)
            this.statusBarItems[this.statusBarItems.length - 1].command = cmd;
        if (tip)
            this.statusBarItems[this.statusBarItems.length - 1].tooltip = tip;
        if (col)
            this.statusBarItems[this.statusBarItems.length - 1].color = col;
        this.statusBarItems[this.statusBarItems.length - 1].show();
    }
}
exports.default = StatusBar;
//# sourceMappingURL=StatusBar.js.map