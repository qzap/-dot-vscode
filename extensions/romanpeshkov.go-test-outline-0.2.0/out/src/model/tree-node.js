"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_status_1 = require("./test-status");
var TreeNodeType;
(function (TreeNodeType) {
    TreeNodeType[TreeNodeType["package"] = 0] = "package";
    TreeNodeType[TreeNodeType["func"] = 1] = "func";
    TreeNodeType[TreeNodeType["bench"] = 2] = "bench";
})(TreeNodeType = exports.TreeNodeType || (exports.TreeNodeType = {}));
class TreeNode {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.status = test_status_1.TestStatus.Unknown;
    }
}
exports.TreeNode = TreeNode;
//# sourceMappingURL=tree-node.js.map