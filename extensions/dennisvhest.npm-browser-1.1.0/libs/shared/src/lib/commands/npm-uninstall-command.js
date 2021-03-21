import { PackageType } from '../package-type';
var NpmUninstallCommand = /** @class */ (function () {
    function NpmUninstallCommand(packageName, packageType) {
        this.packageName = packageName;
        this.packageType = packageType;
        this.type = 'npm-uninstall';
        this.runAsVSCodeTask = true;
        var dependencyTypeFlag;
        var optionFlags = [];
        switch (packageType) {
            case PackageType.Dependency:
                dependencyTypeFlag = '--save';
                break;
            case PackageType.DevDependency:
                dependencyTypeFlag = '--save-dev';
                break;
            case PackageType.OptionalDependency:
                dependencyTypeFlag = '--save-optional';
                break;
        }
        if (dependencyTypeFlag)
            optionFlags.push(dependencyTypeFlag);
        this.command = "npm uninstall " + this.packageName + optionFlags.map(function (o) { return ' ' + o; }).join('');
    }
    return NpmUninstallCommand;
}());
export { NpmUninstallCommand };
//# sourceMappingURL=npm-uninstall-command.js.map