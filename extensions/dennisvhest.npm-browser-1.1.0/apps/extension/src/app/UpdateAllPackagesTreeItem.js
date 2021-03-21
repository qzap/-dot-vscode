import * as tslib_1 from "tslib";
import * as path from 'path';
import * as vscode from 'vscode';
import { TreeItem } from "vscode";
var UpdateAllPackagesTreeItem = /** @class */ (function (_super) {
    tslib_1.__extends(UpdateAllPackagesTreeItem, _super);
    function UpdateAllPackagesTreeItem(context) {
        var _this = _super.call(this, 'Update all packages') || this;
        _this.command = {
            command: "npm-browser.update-all-packages",
            title: "Update all packages"
        };
        _this.iconPath = vscode.Uri.file(path.join(context.extensionPath, '/apps/extension/src/assets', "update-all.svg"));
        return _this;
    }
    return UpdateAllPackagesTreeItem;
}(TreeItem));
export { UpdateAllPackagesTreeItem };
//# sourceMappingURL=UpdateAllPackagesTreeItem.js.map