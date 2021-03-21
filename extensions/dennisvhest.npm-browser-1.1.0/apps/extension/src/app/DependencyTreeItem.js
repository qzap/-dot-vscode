import * as tslib_1 from "tslib";
import * as path from 'path';
import * as vscode from 'vscode';
import { TreeItem } from 'vscode';
var DependencyTreeItem = /** @class */ (function (_super) {
    tslib_1.__extends(DependencyTreeItem, _super);
    function DependencyTreeItem(name, version, updates, context) {
        var _this = _super.call(this, "" + name) || this;
        var hasUpdate = updates && updates.hasUpdateInRange;
        _this.description = "(" + version + ") " + (hasUpdate ? "- Update (" + updates.wanted + ") available" : '');
        _this.tooltip = name + " (" + version + ") " + (hasUpdate ? "- Has a new version (" + updates.wanted + ") within the version range specified in the package.json" : '');
        _this.packageName = name;
        _this.packageVersion = version;
        _this.command = {
            command: "npm-browser.open-package-detail",
            title: "Open package detail",
            arguments: [_this.packageName]
        };
        _this.iconPath = {
            light: vscode.Uri.file(path.join(context.extensionPath, '/apps/extension/src/assets', "dependency-" + (hasUpdate ? 'update-' : '') + "light.svg")),
            dark: vscode.Uri.file(path.join(context.extensionPath, '/apps/extension/src/assets', "dependency-" + (hasUpdate ? 'update-' : '') + "dark.svg"))
        };
        return _this;
    }
    return DependencyTreeItem;
}(TreeItem));
export { DependencyTreeItem };
//# sourceMappingURL=DependencyTreeItem.js.map