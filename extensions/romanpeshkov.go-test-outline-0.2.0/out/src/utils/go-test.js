"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const child = require("child_process");
const path = require("path");
class GoTest {
    constructor(channel, parser, config) {
        this.channel = channel;
        this.parser = parser;
        this.config = config;
    }
    launch(pkgName = './...', funcName = undefined) {
        const launchParams = this.config.get('go-test-params', '');
        return new Promise(resolve => {
            let cmd = `go test -v`;
            if (launchParams.length > 0) {
                cmd += ` ` + launchParams;
            }
            if (funcName) {
                cmd += ` -run "^${funcName}$"`;
            }
            cmd += ` ${pkgName}`;
            const execOptions = {
                cwd: vscode.workspace.rootPath
            };
            child.exec(cmd, execOptions, (error, stdout, stderr) => {
                const output = this.expandFilePathInOutput(stdout, vscode.workspace.rootPath);
                this.channel.appendLine(output);
                const testResult = this.parser.parse(stdout);
                resolve(testResult);
            });
        });
    }
    /**
     * Expands test file paths to full.
     * Taken from vscode-go with small change \t -> \s+. This change expands paths also in subtests runs
     * https://github.com/Microsoft/vscode-go/blob/master/src/goTest.ts
     */
    expandFilePathInOutput(output, cwd) {
        let lines = output.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let matches = lines[i].match(/^\s+(\S+_test.go):(\d+):/);
            if (matches) {
                lines[i] = lines[i].replace(matches[1], path.join(cwd, matches[1]));
            }
        }
        return lines.join('\n');
    }
}
exports.GoTest = GoTest;
//# sourceMappingURL=go-test.js.map