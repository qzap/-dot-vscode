"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
const path = require("path");
const child_process = require("child_process");
function activate(context) {
    Service.instance.registerCommand(context);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
/**
 *  单例
 */
class Service {
    static get instance() {
        var _a;
        Service._instance = (_a = Service._instance) !== null && _a !== void 0 ? _a : new Service();
        return Service._instance;
    }
    /**
     * 注册命令
     * @param context
     */
    registerCommand(context) {
        vscode.window.registerTreeDataProvider('build_runner_view', BuildRunnerTreeProvider.instance);
        context.subscriptions.push(vscode.commands.registerCommand('build_runner.watch', (uri) => this.watchCommand(uri)));
        context.subscriptions.push(vscode.commands.registerCommand('build_runner.watch.refresh', (args) => this.refreshWatchCommand(args)));
        context.subscriptions.push(vscode.commands.registerCommand('build_runner.watch.quit', (args) => this.quitWatchCommand(args.cwd)));
        context.subscriptions.push(vscode.commands.registerCommand('build_runner.build', (uri) => this.buildCommand(uri)));
        context.subscriptions.push(vscode.commands.registerCommand('build_runner.build.all', (uri) => this.buildallCommand(uri)));
    }
    /**
     * 输出通道
     */
    get outputChannel() {
        var _a;
        this._outputChannel = (_a = this._outputChannel) !== null && _a !== void 0 ? _a : vscode.window.createOutputChannel('build_runner');
        return this._outputChannel;
    }
    ;
    /**
    * 运行build_runner watch
    */
    watchCommand(uri) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const pubspec = yield util_1.readYaml(uri);
            //解析yaml错误
            if (!pubspec) {
                this.outputChannel.appendLine(`${uri.fsPath} Invalid format on ${uri.fsPath}`);
                return;
            }
            const keys1 = (_b = Object.keys((_a = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dependencies) !== null && _a !== void 0 ? _a : {})) !== null && _b !== void 0 ? _b : [];
            const keys2 = (_d = Object.keys((_c = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dev_dependencies) !== null && _c !== void 0 ? _c : {})) !== null && _d !== void 0 ? _d : [];
            const include = [...keys1, ...keys2].includes('build_runner');
            //不存在 build_runner
            if (!include) {
                this.outputChannel.clear();
                const packageName = (_e = pubspec.name) !== null && _e !== void 0 ? _e : 'unknown';
                this.outputChannel.appendLine(`[${packageName}] No build_runner were found in the package.`);
                this.outputChannel.show();
                return;
            }
            //包名
            const packageName = (_f = pubspec === null || pubspec === void 0 ? void 0 : pubspec.name) !== null && _f !== void 0 ? _f : 'unknown';
            //运行命令的路径
            const cwd = path.join(uri.fsPath, '../');
            this.quitWatchCommand(cwd);
            const spawn = child_process.spawn('flutter packages pub run build_runner watch --delete-conflicting-outputs', [], {
                windowsVerbatimArguments: true,
                cwd: cwd,
                shell: true
            });
            BuildRunnerTreeProvider.instance.items[cwd] = new BuildRunnerTreeItem(packageName, cwd, spawn, vscode.TreeItemCollapsibleState.None);
            const item = BuildRunnerTreeProvider.instance.items[cwd];
            const sp = item.spawn;
            sp.stderr.on('data', (data) => {
                this.outputChannel.show();
                this.outputChannel.append(`[${packageName}] Error: ${data}\n`);
            });
            //储存一个方法  用来控制loading
            let report;
            sp.stdout.on('data', (data) => __awaiter(this, void 0, void 0, function* () {
                if (!report) {
                    vscode.window.withProgress({
                        location: vscode.ProgressLocation.Window,
                        title: `[${packageName}]  build_runner watch`,
                        cancellable: true
                    }, (progress) => {
                        return new Promise((resolve, reject) => {
                            report = (increment) => {
                                progress.report({ message: undefined, increment: increment });
                                report = undefined;
                                resolve();
                            };
                        });
                    });
                }
                if (data.indexOf('Succeeded after') !== -1) {
                    report === null || report === void 0 ? void 0 : report(100);
                }
            }));
            sp.on('exit', (code) => {
                report === null || report === void 0 ? void 0 : report(100);
                this.quitWatchCommand(cwd);
            });
            BuildRunnerTreeProvider.instance.refresh();
        });
    }
    /**
     * 停止build_runner watch
     * @param cwd
     */
    quitWatchCommand(cwd) {
        var _a, _b, _c;
        const item = (_a = BuildRunnerTreeProvider.instance) === null || _a === void 0 ? void 0 : _a.items[cwd];
        if (item) {
            const spawn = (_c = (_b = BuildRunnerTreeProvider.instance) === null || _b === void 0 ? void 0 : _b.items[cwd]) === null || _c === void 0 ? void 0 : _c.spawn;
            spawn === null || spawn === void 0 ? void 0 : spawn.kill();
            delete BuildRunnerTreeProvider.instance.items[cwd];
            BuildRunnerTreeProvider.instance.refresh();
        }
    }
    /**
    * 刷新build_runner watch
    */
    refreshWatchCommand(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = BuildRunnerTreeProvider.instance;
            const cwd = args.cwd;
            this.quitWatchCommand(cwd);
            delete instance.items[cwd];
            BuildRunnerTreeProvider.instance.refresh();
            const filePath = path.join(`${cwd}`, 'pubspec.yaml');
            const uri = vscode.Uri.file(filePath);
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
            this.watchCommand(uri);
        });
    }
    /**
    * 运行build_runner build
    */
    buildCommand(uri) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const pubspec = yield util_1.readYaml(uri);
            //解析yaml错误
            if (!pubspec) {
                this.outputChannel.appendLine(`${uri.fsPath} Invalid format on ${uri.fsPath}`);
                return;
            }
            const keys1 = (_b = Object.keys((_a = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dependencies) !== null && _a !== void 0 ? _a : {})) !== null && _b !== void 0 ? _b : [];
            const keys2 = (_d = Object.keys((_c = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dev_dependencies) !== null && _c !== void 0 ? _c : {})) !== null && _d !== void 0 ? _d : [];
            const include = [...keys1, ...keys2].includes('build_runner');
            if (!include) {
                this.outputChannel.clear();
                const packageName = (_e = pubspec.name) !== null && _e !== void 0 ? _e : 'unknown';
                this.outputChannel.appendLine(`[${packageName}] No build_runner were found in the package.`);
                this.outputChannel.show();
                return;
            }
            this.runBuildRunnerBuild(uri);
        });
    }
    /**
    * 运行全部build_runner build
    */
    buildallCommand(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield vscode.window.showInformationMessage('为工作区内的所有pubspec.yaml运行build_runner build，此过程可能会持续较长时间，是否继续？', '是', '否');
            if (res !== '是') {
                return;
            }
            //扫描工作区内下所有pub.yaml文件
            const uris = yield vscode.workspace.findFiles('**/pubspec.yaml');
            this.outputChannel.clear();
            if (uris.length === 0) {
                this.outputChannel.appendLine('No pubspec.yaml were found in the workspace.');
                this.outputChannel.show();
                return;
            }
            for (const iterator of uris) {
                const msg = yield this.runBuildRunnerBuild(iterator);
                if (msg === 'quit') {
                    break;
                }
            }
        });
    }
    /**
         * 填入pubspec.yaml路径，运行 build_runner build
         * @param uri pubspec.yaml URI
         * @param onQuit 点击取消时触发
         */
    runBuildRunnerBuild(uri) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const pubspec = yield util_1.readYaml(uri);
            //解析yaml错误
            if (!pubspec) {
                this.outputChannel.appendLine(`${uri.fsPath} Invalid format on ${uri.fsPath}`);
                return;
            }
            const keys1 = (_b = Object.keys((_a = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dependencies) !== null && _a !== void 0 ? _a : {})) !== null && _b !== void 0 ? _b : [];
            const keys2 = (_d = Object.keys((_c = pubspec === null || pubspec === void 0 ? void 0 : pubspec.dev_dependencies) !== null && _c !== void 0 ? _c : {})) !== null && _d !== void 0 ? _d : [];
            const include = [...keys1, ...keys2].includes('build_runner');
            //不存在 build_runner
            if (!include) {
                this.outputChannel.clear();
                const packageName = (_e = pubspec.name) !== null && _e !== void 0 ? _e : 'unknown';
                this.outputChannel.appendLine(`[${packageName}] No build_runner were found in the package.`);
                this.outputChannel.show();
                return;
            }
            //包名
            const packageName = (_f = pubspec.name) !== null && _f !== void 0 ? _f : 'unknown';
            //运行命令的路径
            const cwd = path.join(uri.fsPath, '../');
            return yield vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `[${packageName}] run build_runner build`,
                cancellable: true
            }, (progress, token) => {
                return new Promise((resolve, reject) => {
                    this.outputChannel.append(`[${packageName}] run build_runner build...\n`);
                    const spawn = child_process.spawn('flutter packages pub run build_runner build --delete-conflicting-outputs', [], {
                        windowsVerbatimArguments: true,
                        cwd: cwd,
                        shell: true
                    });
                    token.onCancellationRequested(() => {
                        this.outputChannel.append(`[${packageName}] emit quit.\n`);
                        spawn.emit('close');
                        spawn.kill();
                        resolve('quit');
                    });
                    spawn.stdout.on('data', (data) => {
                        progress.report({ message: `${data}` });
                    });
                    spawn.stderr.on('data', (data) => {
                        progress.report({ message: undefined, increment: 100 });
                        this.outputChannel.append(`[${packageName}] Error: ${data}\n`);
                        this.outputChannel.show();
                    });
                    spawn.on('exit', (code) => {
                        spawn.kill();
                        this.outputChannel.append(`[${packageName}] exit code ${code}\n\n\n\n`);
                        progress.report({ message: undefined, increment: 100 });
                        resolve('exit');
                    });
                });
            });
        });
    }
}
/**
 * 当前已启动的watch列表
 */
class BuildRunnerTreeProvider {
    constructor() {
        this.items = {};
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    /**
     * 单例
     */
    static get instance() {
        var _a;
        BuildRunnerTreeProvider._instance = (_a = BuildRunnerTreeProvider._instance) !== null && _a !== void 0 ? _a : new BuildRunnerTreeProvider();
        return BuildRunnerTreeProvider._instance;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.keys(this.items).map(e => this.items[e]);
        });
    }
}
class BuildRunnerTreeItem extends vscode.TreeItem {
    constructor(label, cwd, spawn, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.cwd = cwd;
        this.spawn = spawn;
        this.tooltip = `${this.cwd}`;
    }
}
//# sourceMappingURL=extension.js.map