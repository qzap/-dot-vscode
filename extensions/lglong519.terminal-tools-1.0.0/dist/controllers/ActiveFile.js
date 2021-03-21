"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const getUri_1 = require("../libs/getUri");
const getActiveTerminal_1 = require("../libs/getActiveTerminal");
/**
 * @classdesc 当前文件的处理
 */
class ActiveFile {
    constructor(options) {
        this.lockFile = '';
        this.terminal = options.terminal;
        this.outputChannel = options.outputChannel;
        this.statusBarItems = options.statusBarItems || [];
    }
    ;
    /**
     * @desc 切换当前文件的锁定
     */
    lock() {
        let color = 'blue', tooltip = 'Unlock';
        if (this.lockFile) {
            this.lockFile = '';
        }
        else {
            color = 'cyan';
            let { file, fullPath } = getUri_1.default();
            this.lockFile = fullPath;
            tooltip = `Lock: ${file}`;
        }
        this.statusBarItems[this.statusBarItems.length - 1].color = color;
        this.statusBarItems[this.statusBarItems.length - 1].tooltip = tooltip;
    }
    /**
     * @desc 运行当前 js/ts 文件
     */
    run() {
        const terminal = getActiveTerminal_1.default(this.terminal);
        let filePath = getUri_1.default().fullPath;
        if (this.lockFile) {
            filePath = this.lockFile;
        }
        // execute cmd
        if (filePath.endsWith('.js')) {
            return terminal.sendText(`node ${filePath}`);
        }
        if (filePath.endsWith('.ts')) {
            return terminal.sendText(`ts-node ${filePath}`);
        }
        vscode_1.window.setStatusBarMessage('Not a JS/TS file.', 3000);
        this.outputChannel.append(`Not a JS/TS file: ${filePath}\n`);
        this.outputChannel.show();
    }
    /**
     * @desc 同步当前文件到服务器
     */
    sync() {
        const terminal = getActiveTerminal_1.default(this.terminal);
        const { filePath, workspace } = getUri_1.default();
        if (filePath.includes('output:extension-output')) {
            return;
        }
        if (filePath) {
            const exec = `file=.${filePath} gulp sync`;
            this.outputChannel.append(`folder: ${workspace}\n`);
            this.outputChannel.append(`file: ${filePath}\n`);
            this.outputChannel.append(`exec: ${exec}\n`);
            terminal.sendText(exec);
        }
    }
    /**
     * @desc 切换到当前文件所在的目录
     */
    cd() {
        const terminal = getActiveTerminal_1.default(this.terminal);
        const { path } = getUri_1.default();
        path && terminal.sendText(`cd ${path}`);
    }
}
exports.default = ActiveFile;
//# sourceMappingURL=ActiveFile.js.map