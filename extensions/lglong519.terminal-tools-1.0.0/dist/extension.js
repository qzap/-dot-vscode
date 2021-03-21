"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const selectItem_1 = require("./handlers/selectItem");
const StatusBar_1 = require("./controllers/StatusBar");
const ActiveFile_1 = require("./controllers/ActiveFile");
const restartActiveTerminal_1 = require("./handlers/restartActiveTerminal");
const Provider_1 = require("./controllers/Provider");
const Selection_1 = require("./controllers/Selection");
const installExtension_1 = require("./handlers/installExtension");
const KillPort_1 = require("./controllers/KillPort");
const debounce_1 = require("./libs/debounce");
const { commands, workspace } = vscode;
const statusBarItems = [];
const statusBar = new StatusBar_1.default(statusBarItems);
const outputChannel = vscode.window.createOutputChannel('terminal-tools');
let terminal = vscode.window.createTerminal({ name: 'terminal-tools' });
const activeFile = new ActiveFile_1.default({
    terminal,
    outputChannel,
    statusBarItems,
});
const selection = new Selection_1.default(activeFile.terminal);
/**
 * @description 当 dispose==false 时会监听到 terminal 已关闭，需重新创建并启动。
 * 当关闭 terminal 时会手动设置 dispose 为 false ，并触发以上条件
 */
const terminalStatus = new Proxy({
    dispose: false
}, {
    set(target, prop, receiver) {
        if (prop == 'dispose') {
            if (receiver) {
                terminal.dispose();
            }
            else {
                terminal = vscode.window.createTerminal({ name: 'terminal-tools' });
                activeFile.terminal = terminal;
                terminal.show();
            }
        }
        return true;
    }
});
/**
 * @description 防止命令面板被意外关闭
 */
vscode.window.onDidCloseTerminal((e) => {
    if (e.name == 'terminal-tools') {
        terminalStatus.dispose = false;
    }
});
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    terminal.show();
    // 底部按钮组
    statusBar.addItem('|');
    statusBar.addItem('Stop', 'terminal-tools.stop', 'Stop current task', 'cyan');
    statusBar.addItem('|');
    statusBar.addItem('Run', 'terminal-tools.run', 'Run acitive js/ts file', 'red');
    statusBar.addItem('|');
    statusBar.addItem('Rerun', 'terminal-tools.rerun', 'Run acitive file again');
    statusBar.addItem('|');
    statusBar.addItem('Clear', 'terminal-tools.clear', 'ClearTerminal', 'yellow');
    statusBar.addItem('cmd', 'terminal-tools.cmd', 'Select directives', 'purple');
    statusBar.addItem('CD', 'terminal-tools.cd', 'CD to current path', '#BAF3BE');
    statusBar.addItem('$(lock)', 'terminal-tools.lock', 'Unlock', 'blue');
    const { subscriptions: sub } = context;
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    sub.push(commands.registerCommand('terminal-tools.stop', restartActiveTerminal_1.default(activeFile.terminal, terminalStatus)));
    sub.push(commands.registerCommand('terminal-tools.run', activeFile.run.bind(activeFile)));
    sub.push(commands.registerCommand('terminal-tools.rerun', () => {
        restartActiveTerminal_1.default(activeFile.terminal, terminalStatus)();
        setTimeout(activeFile.run.bind(activeFile), 500);
    }));
    sub.push(commands.registerCommand('terminal-tools.clear', () => {
        commands.executeCommand('workbench.action.terminal.clear');
    }));
    sub.push(commands.registerCommand('terminal-tools.cmd', () => selectItem_1.default(terminal, outputChannel)));
    sub.push(commands.registerCommand('terminal-tools.lock', activeFile.lock.bind(activeFile)));
    sub.push(commands.registerCommand('terminal-tools.cd', activeFile.cd.bind(activeFile)));
    // treevView
    const treeDataProvider = new Provider_1.default();
    vscode.window.createTreeView('terminal-tools', {
        treeDataProvider,
        showCollapseAll: true
    });
    commands.registerCommand('terminal-tools.install', node => selection.install(node, '-S'));
    commands.registerCommand('terminal-tools.uninstall', node => selection.install(node, '', 'un'));
    commands.registerCommand('terminal-tools.uninstall-g', node => selection.install(node, '-g', 'un'));
    commands.registerCommand('terminal-tools.dev', node => selection.install(node, '-D'));
    commands.registerCommand('terminal-tools.global', node => selection.install(node, '-g'));
    commands.registerCommand('terminal-tools.vsix', () => installExtension_1.default(terminal, outputChannel));
    commands.registerCommand('terminal-tools.sync', activeFile.sync.bind(activeFile));
    commands.registerCommand('terminal-tools.kill', new KillPort_1.default(outputChannel));
    sub.push(commands.registerCommand('terminal-tools.refresh', debounce_1.default(() => treeDataProvider.refresh(), 1000)));
    sub.push(workspace.onDidChangeConfiguration(debounce_1.default(() => treeDataProvider.refresh(), 1000)));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map