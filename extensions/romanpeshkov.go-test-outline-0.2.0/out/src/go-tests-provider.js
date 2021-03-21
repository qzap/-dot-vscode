"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const go_file_1 = require("./utils/go-file");
const go_list_1 = require("./utils/go-list");
const tree_node_1 = require("./model/tree-node");
const test_status_1 = require("./model/test-status");
class GoTestsProvider {
    constructor(workspaceRoot, goTest) {
        this.workspaceRoot = workspaceRoot;
        this.goTest = goTest;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        /**
         * Mapping of status to respective images filenames
         */
        this.statusIcons = new Map([
            [test_status_1.TestStatus.Unknown, 'test.svg'],
            [test_status_1.TestStatus.Failed, 'failed.svg'],
            [test_status_1.TestStatus.Passed, 'passed.svg'],
            [test_status_1.TestStatus.Skipped, 'skipped.svg'],
        ]);
        this.goList = new go_list_1.GoList(workspaceRoot);
        vscode.commands.registerCommand('gotests_internal.select', (node) => this.selected = node);
        vscode.workspace.onDidSaveTextDocument((x) => __awaiter(this, void 0, void 0, function* () {
            this.tree = yield this.buildTree();
            this._onDidChangeTreeData.fire();
        }));
    }
    getTreeItem(element) {
        const collapsibleState = element.child && element.child.length > 0
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.None;
        let treeItem = new vscode.TreeItem(element.name, collapsibleState);
        treeItem.iconPath = path.join(__filename, '..', '..', '..', 'resources', this.statusIcons.get(element.status));
        treeItem.contextValue = 'gotest';
        treeItem.command = {
            command: 'gotests_internal.select',
            title: '',
            arguments: [element]
        };
        return treeItem;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.workspaceRoot) {
                vscode.window.showInformationMessage('Unable to find tests');
                return Promise.resolve([]);
            }
            if (!element) {
                this.tree = yield this.buildTree();
                return this.tree;
            }
            return element.child;
        });
    }
    launch(test) {
        return __awaiter(this, void 0, void 0, function* () {
            test = test || this.selected;
            const results = yield this.goTest.launch(test.pkgName, test.funcName);
            this.updateStatuses(this.tree, results);
        });
    }
    launchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.goTest.launch();
            this.updateStatuses(this.tree, results);
        });
    }
    buildTree() {
        return __awaiter(this, void 0, void 0, function* () {
            const tree = [];
            const packages = yield this.goList.getProjectPackages();
            for (const packageName of packages) {
                const packageInfo = yield this.goList.getPackageInfo(packageName);
                let packageTestFunctions = [];
                if (packageInfo.TestGoFiles && packageInfo.TestGoFiles.length > 0) {
                    for (const testFile of packageInfo.TestGoFiles) {
                        const fullTestFile = path.join(packageInfo.Dir, testFile);
                        const fileTestFunctions = yield go_file_1.GoFile.getTestFunctions(fullTestFile);
                        packageTestFunctions = packageTestFunctions.concat(fileTestFunctions);
                    }
                }
                if (packageInfo.XTestGoFiles && packageInfo.XTestGoFiles.length > 0) {
                    for (const testFile of packageInfo.XTestGoFiles) {
                        const fullTestFile = path.join(packageInfo.Dir, testFile);
                        const fileTestFunctions = yield go_file_1.GoFile.getTestFunctions(fullTestFile);
                        packageTestFunctions = packageTestFunctions.concat(fileTestFunctions);
                    }
                }
                if (packageTestFunctions.length > 0) {
                    const node = new tree_node_1.TreeNode(packageName, tree_node_1.TreeNodeType.package);
                    node.child = [];
                    node.pkgName = packageName;
                    const prevNode = this.tree && this.tree.find(x => x.pkgName === packageName);
                    node.status = prevNode ? prevNode.status : test_status_1.TestStatus.Unknown;
                    for (const testFunction of packageTestFunctions) {
                        const fnode = new tree_node_1.TreeNode(testFunction, tree_node_1.TreeNodeType.func);
                        fnode.pkgName = node.pkgName;
                        fnode.funcName = testFunction;
                        if (prevNode && prevNode.child) {
                            const prevFuncNode = prevNode.child.find(x => x.funcName === testFunction);
                            fnode.status = prevFuncNode ? prevFuncNode.status : fnode.status;
                        }
                        node.child.push(fnode);
                    }
                    tree.push(node);
                }
            }
            return tree;
        });
    }
    updateStatuses(nodes, results) {
        for (const n of nodes || []) {
            const k = n.funcName || n.pkgName;
            if (results.has(k)) {
                n.status = results.get(k);
            }
            this.updateStatuses(n.child, results);
        }
        this._onDidChangeTreeData.fire();
    }
}
exports.GoTestsProvider = GoTestsProvider;
//# sourceMappingURL=go-tests-provider.js.map