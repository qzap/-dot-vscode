"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ListItem_1 = require("./ListItem");
const models_1 = require("../models");
const tools_1 = require("../models/tools");
let libs = models_1.default();
class DepNodeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        libs = models_1.default();
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            if (element.label == 'tools') {
                return Promise.resolve(this.fetchItems(libs[element.label], 0, 1, element.label));
            }
            return Promise.resolve(this.fetchItems(libs[element.label], 0, 0, element.label));
        }
        return Promise.resolve(this.fetchItems(libs.rootItems));
    }
    fetchItems(items, collapsibleState = vscode.TreeItemCollapsibleState.Collapsed, cmd, contextValue) {
        if (!items) {
            return [];
        }
        return items.map(item => {
            if (cmd) {
                let command = {
                    title: item,
                    command: `terminal-tools.${tools_1.default[item]}`
                };
                return new ListItem_1.default(item, collapsibleState, contextValue, command);
            }
            return new ListItem_1.default(item, collapsibleState, contextValue);
        });
    }
}
exports.default = DepNodeProvider;
//# sourceMappingURL=Provider.js.map