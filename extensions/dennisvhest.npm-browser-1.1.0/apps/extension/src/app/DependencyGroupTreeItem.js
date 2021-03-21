import * as tslib_1 from "tslib";
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
var DependencyGroupTreeItem = /** @class */ (function (_super) {
    tslib_1.__extends(DependencyGroupTreeItem, _super);
    function DependencyGroupTreeItem(name, children) {
        var _this = _super.call(this, name) || this;
        _this.children = children;
        _this.collapsibleState = TreeItemCollapsibleState.Expanded;
        return _this;
    }
    return DependencyGroupTreeItem;
}(TreeItem));
export { DependencyGroupTreeItem };
//# sourceMappingURL=DependencyGroupTreeItem.js.map