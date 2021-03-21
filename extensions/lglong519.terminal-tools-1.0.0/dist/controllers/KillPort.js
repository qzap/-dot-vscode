"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const vscode = require("vscode");
const getUri_1 = require("../libs/getUri");
class default_1 {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
        this.password = '';
        return this.main.bind(this);
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const port = yield vscode.window.showInputBox({ prompt: 'The port number to be killed', placeHolder: 'port', ignoreFocusOut: false });
                if (!port) {
                    return;
                }
                let exec = `netstat -ap | grep ${port}`;
                if (getUri_1.default().system == 'windows') {
                    exec = `netstat -ano |findstr ${port}`;
                }
                let pid = yield this.process(exec);
                if (pid) {
                    yield this.kill(pid);
                }
            }
            catch (e) {
                this.logErr(e);
            }
        });
    }
    kill(stdout) {
        let clients = stdout.match(/LISTEN\s*(\d+)\/\w+|ESTABLISHED\s*(\d+)\/\w+|LISTENING\s+(\d+)/g);
        if (clients) {
            let getPid = clients[clients.length - 1].match(/(\d+)\/?/);
            if (getPid) {
                let killExec = `kill ${getPid[1]}`;
                if (getUri_1.default().system == 'windows') {
                    killExec = `tskill ${getPid[1]}`;
                }
                return this.process(killExec);
            }
        }
    }
    process(exec) {
        return new Promise((res, rej) => {
            child_process.exec(exec, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                let errMsg = String(err) || '';
                if ((/have\s*to\s*be\s*root/).test(stderr) || (/Operation\s*not\s*permitted/).test(errMsg)) {
                    const pwd = yield vscode.window.showInputBox({ prompt: '[sudo] password', placeHolder: 'password', ignoreFocusOut: false, value: this.password });
                    if (pwd) {
                        this.password = pwd;
                    }
                    else {
                        return rej('Password is required');
                    }
                    return child_process.exec(`echo "${pwd}" | sudo -S ${exec}`, (err, stdout, stderr) => {
                        if (err) {
                            return rej(err);
                        }
                        res(stdout);
                    });
                }
                if (err) {
                    return rej(err);
                }
                res(stdout);
            }));
        });
    }
    logErr(err) {
        this.outputChannel.append(String(err));
        this.outputChannel.show();
    }
}
exports.default = default_1;
//# sourceMappingURL=KillPort.js.map