import * as tslib_1 from "tslib";
import * as vscode from 'vscode';
import { PackageType, PackageUpdatesItem, NpmOutdatedCommand, NpmUpdateCommand, CommandTypes } from '../../../../libs/shared/src/index';
import { BehaviorSubject } from 'rxjs';
import * as fs from "fs";
import * as readPackageJson from 'read-package-json';
import * as util from 'util';
import * as cp from 'child_process';
var NPMTerminal = /** @class */ (function () {
    function NPMTerminal() {
        var _this = this;
        this._currentCommands = [];
        this._packageJson$ = new BehaviorSubject(undefined);
        this._packageJsons$ = new BehaviorSubject([]);
        this._packageUpdates$ = new BehaviorSubject({});
        this.postCommandListeners = {
            'npm-install': function () { return _this.afterNPMInstall; },
            'npm-uninstall': function () { return _this.afterNPMUninstall; },
            'npm-outdated': function () { return _this.afterNpmOutdatedCommand; },
            'npm-update': function () { return _this.afterNPMUpdate; }
        };
        this.setPackageJson = function (packageJson) {
            _this._packageJson$.next(packageJson);
            if (_this._packageJsonFileWatcher)
                _this._packageJsonFileWatcher.dispose();
            if (!_this._packageJson)
                return;
            _this._packageJsonFileWatcher = vscode.workspace.createFileSystemWatcher(_this._packageJson.filePath, true, false, false);
            _this._packageJsonFileWatcher.onDidChange(_this.onPackageJsonFileChanged);
            _this._packageJsonFileWatcher.onDidDelete(_this.onPackageJsonFileDeleted);
            _this.checkPackageUpdates();
        };
        this.onPackageJsonsChanged = function (uri) {
            if (!uri.path.includes('**/node_modules/**'))
                _this.findPackageJsons();
        };
        this.findPackageJsons = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var packageJsonFiles, readPackageJsonFiles, packageJsons;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vscode.workspace.findFiles('**/package.json', '**/node_modules/**')];
                    case 1:
                        packageJsonFiles = _a.sent();
                        if (!packageJsonFiles.length)
                            this._packageJsons$.next([]);
                        readPackageJsonFiles = packageJsonFiles
                            .map(function (packageJsonUri) { return _this.loadPackageJson(packageJsonUri.fsPath); })
                            .map(function (p) { return p.catch(function (e) { return null; }); });
                        return [4 /*yield*/, Promise.all(readPackageJsonFiles)];
                    case 2:
                        packageJsons = (_a.sent()).filter(function (f) { return f !== null; });
                        this._packageJsons$.next(packageJsons);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onPackageJsonFileChanged = function (packageJsonUri) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var changedPackageJson, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadPackageJson(packageJsonUri.fsPath)];
                    case 1:
                        changedPackageJson = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        changedPackageJson = null;
                        return [3 /*break*/, 3];
                    case 3:
                        if (!changedPackageJson) return [3 /*break*/, 4];
                        changedPackageJson = tslib_1.__assign({}, changedPackageJson, { filePath: changedPackageJson.filePath });
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.findPackageJsons()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        this._packageJson$.next(changedPackageJson);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onPackageJsonFileDeleted = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPackageJsons()];
                    case 1:
                        _a.sent();
                        this._packageJson$.next(null);
                        return [2 /*return*/];
                }
            });
        }); };
        this.completeCommand = function (success, result) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (this.postCommandListeners[this._currentCommand.type])
                    this.postCommandListeners[this._currentCommand.type]()(success, result);
                if (this.onCommandComplete)
                    this.onCommandComplete(this._currentCommand, success, result);
                this._currentCommands.shift();
                this.runNextCommand();
                return [2 /*return*/];
            });
        }); };
        this.afterNPMInstall = function () {
            var installCommand = _this._currentCommand;
            var packageJson = JSON.parse(fs.readFileSync(_this._packageJson.filePath, 'utf8'));
            var dependencyType = _this.getPackageJsonDependencyField(installCommand.packageType);
            if (packageJson.dependencies && packageJson.dependencies[installCommand.packageName])
                packageJson.dependencies[installCommand.packageName] = installCommand.versionRange;
            if (packageJson[dependencyType] && packageJson[dependencyType][installCommand.packageName])
                packageJson[dependencyType][installCommand.packageName] = installCommand.versionRange;
            fs.writeFileSync(_this._packageJson.filePath, JSON.stringify(packageJson, null, 2));
            _this.checkPackageUpdates();
        };
        this.afterNPMUninstall = function () {
            _this.checkPackageUpdates();
        };
        this.afterNPMUpdate = function () {
            _this.checkPackageUpdates();
        };
        this.afterNpmOutdatedCommand = function (success, result) {
            if (!success || !result || result.error) {
                _this._packageUpdates$.next({});
                return;
            }
            for (var _i = 0, _a = Object.keys(result); _i < _a.length; _i++) {
                var packageName = _a[_i];
                result[packageName] = new PackageUpdatesItem(result[packageName]);
            }
            _this._packageUpdates$.next(result);
        };
        /**
         * Adds the given command to the queue to be processed. If the given command is the only one in the queue, it is immediately run.
         * @param command TerminalCommand to enqueue.
         */
        this.queueCommand = function (command) {
            _this._currentCommands.push(command);
            if (_this._currentCommands.length === 1)
                _this.runNextCommand();
        };
        /**
         * Runs the next TerminalCommand in the NPM terminal.
         */
        this.runNextCommand = function () {
            var nextCommand = _this._currentCommands[0];
            if (nextCommand) {
                if (nextCommand.runAsVSCodeTask) {
                    _this.runCommandAsVSCodeTask(nextCommand);
                }
                else {
                    _this.runCommandAsChildProcess(nextCommand);
                }
            }
        };
        this.runCommandAsVSCodeTask = function (command) {
            var task = new vscode.Task({ type: 'npm', task: command.type }, vscode.TaskScope.Workspace, command.type, 'npm', new vscode.ShellExecution(command.command, { cwd: _this.packageJsonPath }));
            vscode.tasks.onDidEndTaskProcess(function (event) {
                if (event.execution.task.name === task.name && event.exitCode !== 0) {
                    _this.completeCommand(false);
                }
                else if (_this._currentCommand && _this._currentCommand === command) {
                    _this.completeCommand(true);
                }
            });
            vscode.tasks.executeTask(task);
        };
        this.runCommandAsChildProcess = function (command) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var stdout, result, e_1, packageInfo;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, util.promisify(cp.exec)(command.command, { cwd: this.packageJsonPath })];
                    case 1:
                        result = _a.sent();
                        stdout = result.stdout;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        // NPM outdated returns exit code 1 when outdated packages are found
                        if (e_1.code === 1 && command.type === CommandTypes.npmOutdated) {
                            stdout = e_1.stdout;
                        }
                        else {
                            console.error("failed to execute command " + command.command);
                            this.completeCommand(false);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        packageInfo = JSON.parse(stdout);
                        this.completeCommand(true, packageInfo);
                        return [2 /*return*/];
                }
            });
        }); };
        var packageJsonsFileWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');
        packageJsonsFileWatcher.onDidChange(this.onPackageJsonsChanged);
        packageJsonsFileWatcher.onDidCreate(this.onPackageJsonsChanged);
        packageJsonsFileWatcher.onDidDelete(this.onPackageJsonsChanged);
    }
    Object.defineProperty(NPMTerminal.prototype, "_currentCommand", {
        get: function () {
            return this._currentCommands[0];
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(NPMTerminal.prototype, "packageJson", {
        get: function () {
            return this._packageJson$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NPMTerminal.prototype, "_packageJson", {
        get: function () {
            return this._packageJson$.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NPMTerminal.prototype, "packageJsons", {
        get: function () {
            return this._packageJsons$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NPMTerminal.prototype, "packageUpdates", {
        get: function () {
            return this._packageUpdates$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NPMTerminal.prototype, "packageJsonPath", {
        get: function () {
            return this._packageJson.filePath.replace(/package\.json$/, '');
        },
        enumerable: true,
        configurable: true
    });
    NPMTerminal.prototype.getPackageJsonDependencyField = function (packageType) {
        switch (packageType) {
            case PackageType.Dependency: return "dependencies";
            case PackageType.DevDependency: return "devDependencies";
            case PackageType.OptionalDependency: return "optionalDependencies";
            default: throw "Unknown package type!";
        }
    };
    NPMTerminal.prototype.loadPackageJson = function (filePath) {
        return new Promise(function (resolve, reject) {
            var _readPackageJson;
            // Fix for difference in commonjs module (production) and es6 module (debug)
            if (readPackageJson.default) {
                _readPackageJson = readPackageJson.default;
            }
            else {
                _readPackageJson = readPackageJson;
            }
            _readPackageJson(filePath, false, function (error, data) {
                // TODO: Test error handling
                if (error)
                    reject(error);
                data.filePath = filePath;
                resolve(data);
            });
        });
    };
    NPMTerminal.prototype.reloadPackageJson = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentPackageJson, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._packageJson) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.loadPackageJson(this._packageJson.filePath)];
                    case 2:
                        currentPackageJson = _a.sent();
                        this.setPackageJson(currentPackageJson);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.setPackageJson(null);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NPMTerminal.prototype.checkPackageUpdates = function () {
        this.queueCommand(new NpmOutdatedCommand());
    };
    NPMTerminal.prototype.updateAllPackages = function () {
        this.queueCommand(new NpmUpdateCommand());
    };
    return NPMTerminal;
}());
export { NPMTerminal };
//# sourceMappingURL=NPMTerminal.js.map