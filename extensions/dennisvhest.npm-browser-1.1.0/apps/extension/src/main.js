import * as tslib_1 from "tslib";
import * as vscode from 'vscode';
import { BrowserWebView } from './app/BrowserWebView';
import { NPMTerminal } from './app/NPMTerminal';
import { CommandTypes, ToastLevels } from '../../../libs/shared/src';
import { DependencyTreeDataProvider } from './app/DependencyTreeDataProvider';
var packageJsonSubscription;
var packageJsonsSubscription;
var openPackageDetailCommandRegistration;
var updateAllPackagesCommandRegistration;
export function activate(context) {
    var _this = this;
    var npmTerminal = new NPMTerminal();
    var browser;
    var selectedPackageJson = context.workspaceState.get('selectedPackageJson');
    if (selectedPackageJson)
        npmTerminal.setPackageJson(selectedPackageJson);
    function reinitializeBrowser() {
        if (!browser || !browser.isOpen) {
            browser = new BrowserWebView(context, true);
        }
        else {
            browser.setActivePanel();
        }
        browser.onTerminalCommand = npmTerminal.queueCommand;
        browser.onValueCommand = onValueCommand;
        browser.onVSCodeToastCommand = onVSCodeToastCommand;
        npmTerminal.onCommandComplete = function (command, success, result) {
            if (command.type === CommandTypes.npmInstall)
                browser.sendCommand({ type: CommandTypes.npmInstallComplete });
            if (command.type === CommandTypes.npmUninstall)
                browser.sendCommand({ type: CommandTypes.npmUninstallComplete });
            if (success) {
                if (command.type === CommandTypes.fetchPackage)
                    browser.sendCommand({ type: CommandTypes.fetchPackageComplete, value: result });
                if (command.type === CommandTypes.npmOutdated)
                    browser.sendCommand({ type: CommandTypes.npmOutdated, value: result });
            }
            else {
                vscode.window.showErrorMessage("Something went wrong executing an NPM command. See the terminal window for details.");
            }
        };
        npmTerminal.findPackageJsons();
        npmTerminal.reloadPackageJson();
    }
    openPackageDetailCommandRegistration = vscode.commands.registerCommand('npm-browser.open-package-detail', function (packageName) {
        reinitializeBrowser();
        var command = { type: CommandTypes.installedPackageSelected, value: packageName };
        browser.sendCommand(command);
    });
    updateAllPackagesCommandRegistration = vscode.commands.registerCommand('npm-browser.update-all-packages', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var response;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Are you sure you want to update all packages?' })];
                case 1:
                    response = _a.sent();
                    if (response === 'Yes') {
                        npmTerminal.updateAllPackages();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    var treeView = vscode.window.createTreeView("dependencies", {
        treeDataProvider: new DependencyTreeDataProvider(npmTerminal.packageJson, npmTerminal.packageUpdates, context)
    });
    treeView.onDidChangeVisibility(function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            if (!event.visible)
                return [2 /*return*/];
            reinitializeBrowser();
            return [2 /*return*/];
        });
    }); });
    function onValueCommand(command) {
        npmTerminal.setPackageJson(command.value);
    }
    function onVSCodeToastCommand(command) {
        switch (command.level) {
            case ToastLevels.error:
                vscode.window.showErrorMessage(command.message);
                break;
            case ToastLevels.info:
            default:
                vscode.window.showInformationMessage(command.message);
                break;
        }
    }
    this.packageJsonsSubscription = npmTerminal.packageJsons.subscribe(function (packageJsons) {
        context.workspaceState.update('packageJsons', packageJsons);
        if (browser && browser.isOpen) {
            var command = { type: CommandTypes.packageJsonsUpdated, value: packageJsons };
            browser.sendCommand(command);
        }
    });
    this.packageJsonSubscription = npmTerminal.packageJson.subscribe(function (changedPackageJson) {
        context.workspaceState.update('selectedPackageJson', changedPackageJson);
        if (browser && browser.isOpen) {
            var command = { type: CommandTypes.packageJsonUpdated, value: changedPackageJson };
            browser.sendCommand(command);
        }
    });
    npmTerminal.findPackageJsons();
    npmTerminal.reloadPackageJson();
}
export function deactivate() {
    if (packageJsonSubscription)
        packageJsonSubscription.unsubscribe();
    if (packageJsonsSubscription)
        packageJsonsSubscription.unsubscribe();
    openPackageDetailCommandRegistration.dispose();
    updateAllPackagesCommandRegistration.dispose();
}
//# sourceMappingURL=main.js.map