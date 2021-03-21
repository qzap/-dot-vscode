/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMissingError = exports.GoDefinitionProvider = exports.adjustWordPosition = exports.definitionLocation = void 0;
const cp = require("child_process");
const path = require("path");
const vscode = require("vscode");
const goEnv_1 = require("./goEnv");
const gopInstallTools_1 = require("./gopInstallTools");
const goModules_1 = require("./goModules");
const util_1 = require("./util");
function definitionLocation(document, position, goPlusConfig, includeDocs, token) {
    const adjustedPos = adjustWordPosition(document, position);
    if (!adjustedPos[0]) {
        return Promise.resolve(null);
    }
    const word = adjustedPos[1];
    position = adjustedPos[2];
    if (!goPlusConfig) {
        goPlusConfig = util_1.getGoPlusConfig(document.uri);
    }
    const toolForDocs = goPlusConfig['docsTool'] || 'godoc';
    return goModules_1.getModFolderPath(document.uri).then((modFolderPath) => {
        const input = {
            document,
            position,
            word,
            includeDocs,
            isMod: !!modFolderPath,
            cwd: modFolderPath && modFolderPath !== util_1.getModuleCache()
                ? modFolderPath
                : util_1.getWorkspaceFolderPath(document.uri) || path.dirname(document.fileName)
        };
        return definitionLocation_godef(input, token);
    });
}
exports.definitionLocation = definitionLocation;
const missingToolMsg = 'Missing tool: ';
function adjustWordPosition(document, position) {
    const wordRange = document.getWordRangeAtPosition(position);
    const lineText = document.lineAt(position.line).text;
    const word = wordRange ? document.getText(wordRange) : '';
    if (!wordRange ||
        lineText.startsWith('//') ||
        util_1.isPositionInString(document, position) ||
        word.match(/^\d+.?\d+$/) ||
        util_1.goKeywords.indexOf(word) > 0) {
        return [false, null, null];
    }
    if (position.isEqual(wordRange.end) && position.isAfter(wordRange.start)) {
        position = position.translate(0, -1);
    }
    return [true, word, position];
}
exports.adjustWordPosition = adjustWordPosition;
const godefImportDefinitionRegex = /^import \(.* ".*"\)$/;
function definitionLocation_godef(input, token, useReceivers = true) {
    const godefTool = 'godef';
    const godefPath = util_1.getBinPath(godefTool);
    if (!path.isAbsolute(godefPath)) {
        return Promise.reject(missingToolMsg + godefTool);
    }
    let offset = util_1.byteOffsetAt(input.document, input.position);
    let inputText = input.document.getText();
    if (!inputText.match(/package\s+(\w+)/)) {
        let addtText = "package main\r\n\r\n";
        offset = offset + addtText.length;
        inputText = addtText + inputText;
    }
    const env = goEnv_1.toolExecutionEnvironment();
    let p;
    if (token) {
        token.onCancellationRequested(() => util_1.killTree(p.pid));
    }
    return new Promise((resolve, reject) => {
        // Spawn `godef` process
        const args = ['-t', '-i', '-f', input.document.fileName, '-o', offset.toString()];
        // if (useReceivers) {
        // 	args.push('-r');
        // }
        console.log(godefPath, args);
        p = cp.execFile(godefPath, args, { env, cwd: input.cwd }, (err, stdout, stderr) => {
            try {
                if (err && err.code === 'ENOENT') {
                    return reject(missingToolMsg + godefTool);
                }
                if (err) {
                    if (input.isMod &&
                        !input.includeDocs &&
                        stderr &&
                        stderr.startsWith(`godef: no declaration found for`)) {
                        goModules_1.promptToUpdateToolForModules('godef', `To get the Go to Definition feature when using Go modules, please update your version of the "godef" tool.`);
                        return reject(stderr);
                    }
                    if (stderr.indexOf('flag provided but not defined: -r') !== -1) {
                        gopInstallTools_1.promptForUpdatingTool('godef');
                        p = null;
                        return definitionLocation_godef(input, token, false).then(resolve, reject);
                    }
                    return reject(err.message || stderr);
                }
                const result = stdout.toString();
                const lines = result.split('\n');
                let match = /(.*):(\d+):(\d+)/.exec(lines[0]);
                if (!match) {
                    // TODO: Gotodef on pkg name:
                    // /usr/local/go/src/html/template\n
                    console.log("not match");
                    return resolve(null);
                }
                const [_, file, line, col] = match;
                const pkgPath = path.dirname(file);
                const definitionInformation = {
                    file,
                    line: +line - 1,
                    column: +col - 1,
                    declarationlines: lines.slice(1),
                    toolUsed: 'godef',
                    doc: null,
                    name: null
                };
                if (!input.includeDocs || godefImportDefinitionRegex.test(definitionInformation.declarationlines[0])) {
                    return resolve(definitionInformation);
                }
                match = /^\w+ \(\*?(\w+)\)/.exec(lines[1]);
                util_1.runGodoc(input.cwd, pkgPath, match ? match[1] : '', input.word, token)
                    .then((doc) => {
                    if (doc) {
                        definitionInformation.doc = doc;
                    }
                    resolve(definitionInformation);
                })
                    .catch((runGoDocErr) => {
                    resolve(definitionInformation);
                });
            }
            catch (e) {
                reject(e);
            }
        });
        if (p.pid) {
            p.stdin.end(inputText);
        }
    });
}
class GoDefinitionProvider {
    constructor(goConfig) {
        this.goConfig = null;
        this.goConfig = goConfig;
    }
    provideDefinition(document, position, token) {
        return definitionLocation(document, position, this.goConfig, false, token).then((definitionInfo) => {
            if (definitionInfo == null || definitionInfo.file == null) {
                return null;
            }
            const definitionResource = vscode.Uri.file(definitionInfo.file);
            const pos = new vscode.Position(definitionInfo.line, definitionInfo.column);
            return new vscode.Location(definitionResource, pos);
        }, (err) => {
            const miss = parseMissingError(err);
            if (miss[0]) {
                gopInstallTools_1.promptForMissingTool(miss[1]);
            }
            else if (err) {
                return Promise.reject(err);
            }
            return Promise.resolve(null);
        });
    }
}
exports.GoDefinitionProvider = GoDefinitionProvider;
function parseMissingError(err) {
    if (err) {
        // Prompt for missing tool is located here so that the
        // prompts dont show up on hover or signature help
        if (typeof err === 'string' && err.startsWith(missingToolMsg)) {
            return [true, err.substr(missingToolMsg.length)];
        }
    }
    return [false, null];
}
exports.parseMissingError = parseMissingError;
//# sourceMappingURL=goDeclaration.js.map