var CommandTypes = /** @class */ (function () {
    function CommandTypes() {
    }
    CommandTypes.npmInstall = 'npm-install';
    CommandTypes.npmInstallComplete = 'npm-install-complete';
    CommandTypes.npmUninstallComplete = 'npm-uninstall-complete';
    CommandTypes.npmUninstall = 'npm-uninstall';
    CommandTypes.fetchPackage = 'fetch-package';
    CommandTypes.fetchPackageComplete = 'fetch-package-complete';
    CommandTypes.npmOutdated = 'npm-outdated';
    CommandTypes.npmUpdate = 'npm-update';
    CommandTypes.packageJsonSelected = 'package-json-selected';
    CommandTypes.packageJsonUpdated = 'package-json-updated';
    CommandTypes.packageJsonsUpdated = 'package-jsons-updated';
    CommandTypes.vsCodeToastCommand = 'vscode-toast-command';
    CommandTypes.installedPackageSelected = 'installed-package-selected';
    return CommandTypes;
}());
export { CommandTypes };
//# sourceMappingURL=command.js.map