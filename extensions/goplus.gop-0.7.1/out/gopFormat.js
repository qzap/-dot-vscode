/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoPlusDocumentFormattingEditProvider = void 0;
const cp = require("child_process");
const path = require("path");
const vscode = require("vscode");
const goEnv_1 = require("./goEnv");
const gopInstallTools_1 = require("./gopInstallTools");
const util_1 = require("./util");
class GoPlusDocumentFormattingEditProvider {
    provideDocumentFormattingEdits(document, options, token) {
        if (vscode.window.visibleTextEditors.every((e) => e.document.fileName !== document.fileName)) {
            return [];
        }
        const filename = document.fileName;
        const goPlusConfig = util_1.getGoPlusConfig(document.uri);
        const formatTool = goPlusConfig['formatTool'] || 'qfmt';
        const formatFlags = goPlusConfig['formatFlags'].slice() || [];
        // We ignore the -w flag that updates file on disk because that would break undo feature
        if (formatFlags.indexOf('-w') > -1) {
            formatFlags.splice(formatFlags.indexOf('-w'), 1);
        }
        return this.runFormatter(formatTool, formatFlags, document, token).then((edits) => edits, (err) => {
            if (typeof err === 'string' && err.startsWith('flag provided but not defined: -srcdir')) {
                gopInstallTools_1.promptForUpdatingTool(formatTool);
                return Promise.resolve([]);
            }
            if (err) {
                console.log(err);
                return Promise.reject('Check the console in dev tools to find errors when formatting.');
            }
        });
    }
    runFormatter(formatTool, formatFlags, document, token) {
        const formatCommandBinPath = util_1.getBinPath(formatTool);
        return new Promise((resolve, reject) => {
            if (!path.isAbsolute(formatCommandBinPath)) {
                gopInstallTools_1.promptForMissingTool(formatTool);
                return reject();
            }
            const env = goEnv_1.toolExecutionEnvironment();
            const cwd = path.dirname(document.fileName);
            let stdout = '';
            let stderr = '';
            // Use spawn instead of exec to avoid maxBufferExceeded error
            const p = cp.spawn(formatCommandBinPath, formatFlags, { env, cwd });
            token.onCancellationRequested(() => !p.killed && util_1.killTree(p.pid));
            p.stdout.setEncoding('utf8');
            p.stdout.on('data', (data) => {
                (stdout += data);
            });
            p.stderr.on('data', (data) => {
                (stderr += data);
            });
            p.on('error', (err) => {
                if (err && err.code === 'ENOENT') {
                    gopInstallTools_1.promptForMissingTool(formatTool);
                    return reject();
                }
            });
            p.on('close', (code) => {
                if (code !== 0) {
                    return reject(stderr);
                }
                // Return the complete file content in the edit.
                // VS Code will calculate minimal edits to be applied
                const fileStart = new vscode.Position(0, 0);
                const fileEnd = document.lineAt(document.lineCount - 1).range.end;
                const textEdits = [
                    new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout)
                ];
                return resolve(textEdits);
            });
            if (p.pid) {
                p.stdin.end(document.getText());
            }
        });
    }
}
exports.GoPlusDocumentFormattingEditProvider = GoPlusDocumentFormattingEditProvider;
//# sourceMappingURL=gopFormat.js.map