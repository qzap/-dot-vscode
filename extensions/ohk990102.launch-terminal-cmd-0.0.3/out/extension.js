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
const net = require("net");
const crypto = require("crypto");
const options = {
    'max_read': 1024,
};
let server;
function createNewSplitTerminal() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand("workbench.action.terminal.split");
            vscode.window.onDidChangeActiveTerminal((terminal) => {
                if (terminal) {
                    resolve(terminal);
                }
            });
        }));
    });
}
function createNewTerminal() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            resolve(vscode.window.createTerminal());
        }));
    });
}
function activate(context) {
    console.log();
    let salt = crypto.randomBytes(6).toString('hex');
    let sockname = `/tmp/vscode-launch-terminal-cmd-${salt}.sock`;
    context.environmentVariableCollection.append('VSCODE_TERMINAL_SOCKET', sockname);
    server = net.createServer((c) => {
        c.setEncoding('utf8');
        c.on('data', (data) => {
            if (data.length > options.max_read) {
                data = data.slice(0, options.max_read);
            }
            if (vscode.workspace.getConfiguration().get("launch-terminal-cmd.defaultLaunchType") === 'split') {
                createNewSplitTerminal().then((terminal) => {
                    terminal.sendText(data, true);
                });
            }
            else {
                vscode.window.createTerminal("debug", "/bin/sh", ["-c", data]);
            }
            c.end();
        });
    });
    server.on('error', (err) => {
        console.log('Error: ' + err);
    });
    server.listen(sockname, () => {
        console.log(`listening on ${sockname}`);
    });
    for (let terminal of vscode.window.terminals) {
        terminal.sendText(`export VSCODE_TERMINAL_SOCKET=${sockname}`);
    }
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    server.close();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map