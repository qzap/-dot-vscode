import { applyRangeOptions } from '../semver/semver-extensions';
import { PackageType } from '../package-type';
var NpmInstallCommand = /** @class */ (function () {
    function NpmInstallCommand(options) {
        this.type = 'npm-install';
        this.runAsVSCodeTask = true;
        this.packageName = options.packageName;
        this.packageType = options.packageType;
        this.versionRange = applyRangeOptions(options.packageVersion, options.updateLevel).raw;
        var optionFlags = [];
        var dependencyTypeFlag;
        switch (options.packageType) {
            case PackageType.Dependency:
                dependencyTypeFlag = '--save-prod';
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
        if (options.updateLevel === 0)
            optionFlags.push('--save-exact');
        this.command = "npm install " + this.packageName + "@\"" + options.packageVersion + "\"" + optionFlags.map(function (o) { return ' ' + o; }).join('');
    }
    return NpmInstallCommand;
}());
export { NpmInstallCommand };
//# sourceMappingURL=npm-install-command.js.map