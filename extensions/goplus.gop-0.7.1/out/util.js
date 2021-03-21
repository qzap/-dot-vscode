"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
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
exports.makeMemoizedByteOffsetConverter = exports.killProcess = exports.getFileArchive = exports.getModuleCache = exports.guessPackageNameFromFile = exports.runGodoc = exports.parseFilePrelude = exports.getParametersAndReturnType = exports.byteOffsetAt = exports.isPositionInString = exports.isPositionInComment = exports.getTempFilePath = exports.rmdirRecursive = exports.killTree = exports.substituteEnv = exports.getCurrentGoPath = exports.getToolsGopath = exports.getWorkspaceFolderPath = exports.resolvePath = exports.getBinPath = exports.getGoConfig = exports.getGoPlusConfig = exports.getGoVersion = exports.GoVersion = exports.goBuiltinTypes = exports.goKeywords = void 0;
const cp = require("child_process");
const vscode = require("vscode");
const util = require("util");
const kill = require("tree-kill");
const avlTree_1 = require("./avlTree");
const goPath_1 = require("./goPath");
const goEnv_1 = require("./goEnv");
const goModules_1 = require("./goModules");
const fs = require("fs");
const os = require("os");
const semver = require("semver");
const path = require("path");
const gopStatus_1 = require("./gopStatus");
exports.goKeywords = [
    'break',
    'case',
    'chan',
    'const',
    'continue',
    'default',
    'defer',
    'else',
    'fallthrough',
    'for',
    'func',
    'go',
    'goto',
    'if',
    'import',
    'interface',
    'map',
    'package',
    'range',
    'return',
    'select',
    'struct',
    'switch',
    'type',
    'var'
];
exports.goBuiltinTypes = new Set([
    'bool',
    'byte',
    'complex128',
    'complex64',
    'error',
    'float32',
    'float64',
    'int',
    'int16',
    'int32',
    'int64',
    'int8',
    'rune',
    'string',
    'uint',
    'uint16',
    'uint32',
    'uint64',
    'uint8',
    'uintptr'
]);
let toolsGopath;
let cachedGoBinPath;
let cachedGoVersion;
let vendorSupport;
class GoVersion {
    constructor(binaryPath, version) {
        this.binaryPath = binaryPath;
        const matchesRelease = /go version go(\d.\d+).*/.exec(version);
        const matchesDevel = /go version devel \+(.[a-zA-Z0-9]+).*/.exec(version);
        if (matchesRelease) {
            const sv = semver.coerce(matchesRelease[0]);
            if (sv) {
                this.sv = sv;
            }
        }
        else if (matchesDevel) {
            this.isDevel = true;
            this.commit = matchesDevel[0];
        }
    }
    isValid() {
        return !!this.sv || !!this.isDevel;
    }
    format() {
        if (this.sv) {
            return this.sv.format();
        }
        return `devel +${this.commit}`;
    }
    lt(version) {
        // Assume a developer version is always above any released version.
        // This is not necessarily true.
        if (this.isDevel || !this.sv) {
            return false;
        }
        const v = semver.coerce(version);
        if (!v) {
            return false;
        }
        return semver.lt(this.sv, v);
    }
    gt(version) {
        // Assume a developer version is always above any released version.
        // This is not necessarily true.
        if (this.isDevel || !this.sv) {
            return true;
        }
        const v = semver.coerce(version);
        if (!v) {
            return false;
        }
        return semver.gt(this.sv, v);
    }
}
exports.GoVersion = GoVersion;
/**
 * Gets version of Go based on the output of the command `go version`.
 * Returns null if go is being used from source/tip in which case `go version` will not return release tag like go1.6.3
 */
function getGoVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const goRuntimePath = getBinPath('go');
        const warn = (msg) => {
            gopStatus_1.outputChannel.appendLine(msg);
            console.warn(msg);
        };
        if (!goRuntimePath) {
            warn(`unable to locate "go" binary in GOROOT (${goPath_1.getCurrentGoRoot()}) or PATH (${goPath_1.envPath})`);
            return;
        }
        if (cachedGoBinPath === goRuntimePath && cachedGoVersion) {
            if (cachedGoVersion.isValid()) {
                return Promise.resolve(cachedGoVersion);
            }
            warn(`cached Go version (${cachedGoVersion}) is invalid, recomputing`);
        }
        try {
            const execFile = util.promisify(cp.execFile);
            const { stdout, stderr } = yield execFile(goRuntimePath, ['version']);
            if (stderr) {
                warn(`failed to run "${goRuntimePath} version": stdout: ${stdout}, stderr: ${stderr}`);
                return;
            }
            cachedGoBinPath = goRuntimePath;
            cachedGoVersion = new GoVersion(goRuntimePath, stdout);
        }
        catch (err) {
            warn(`failed to run "${goRuntimePath} version": ${err}`);
            return;
        }
        return cachedGoVersion;
    });
}
exports.getGoVersion = getGoVersion;
// getGoPlusConfig is declared as an exported const rather than a function, so it can be stubbbed in testing.
exports.getGoPlusConfig = (uri) => {
    if (!uri) {
        if (vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        }
        else {
            uri = null;
        }
    }
    return vscode.workspace.getConfiguration('goplus', uri);
};
// getGoConfig is declared as an exported const rather than a function, so it can be stubbbed in testing.
exports.getGoConfig = (uri) => {
    if (!uri) {
        if (vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        }
        else {
            uri = null;
        }
    }
    return vscode.workspace.getConfiguration('go', uri);
};
function getBinPath(tool, useCache = true) {
    const cfg = exports.getGoConfig();
    const alternateTools = cfg.get('alternateTools');
    const alternateToolPath = alternateTools[tool];
    return goPath_1.getBinPathWithPreferredGopathGoroot(tool, tool === 'go' ? [] : [getToolsGopath(), getCurrentGoPath()], tool === 'go' && cfg.get('goroot') ? cfg.get('goroot') : undefined, resolvePath(alternateToolPath), useCache);
}
exports.getBinPath = getBinPath;
/**
 * Expands ~ to homedir in non-Windows platform and resolves ${workspaceFolder} or ${workspaceRoot}
 */
function resolvePath(inputPath, workspaceFolder) {
    if (!inputPath || !inputPath.trim()) {
        return inputPath;
    }
    if (!workspaceFolder && vscode.workspace.workspaceFolders) {
        workspaceFolder = getWorkspaceFolderPath(vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri);
    }
    if (workspaceFolder) {
        inputPath = inputPath.replace(/\${workspaceFolder}|\${workspaceRoot}/g, workspaceFolder);
    }
    return goPath_1.resolveHomeDir(inputPath);
}
exports.resolvePath = resolvePath;
function getWorkspaceFolderPath(fileUri) {
    if (fileUri) {
        const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
        if (workspace) {
            return goPath_1.fixDriveCasingInWindows(workspace.uri.fsPath);
        }
    }
    // fall back to the first workspace
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length) {
        return goPath_1.fixDriveCasingInWindows(folders[0].uri.fsPath);
    }
}
exports.getWorkspaceFolderPath = getWorkspaceFolderPath;
function getToolsGopath(useCache = true) {
    if (!useCache || !toolsGopath) {
        toolsGopath = resolveToolsGopath();
    }
    return toolsGopath;
}
exports.getToolsGopath = getToolsGopath;
function resolveToolsGopath() {
    let toolsGopathForWorkspace = substituteEnv(exports.getGoConfig()['toolsGopath'] || '');
    // In case of single root
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length <= 1) {
        return resolvePath(toolsGopathForWorkspace);
    }
    // In case of multi-root, resolve ~ and ${workspaceFolder}
    if (toolsGopathForWorkspace.startsWith('~')) {
        toolsGopathForWorkspace = path.join(os.homedir(), toolsGopathForWorkspace.substr(1));
    }
    if (toolsGopathForWorkspace &&
        toolsGopathForWorkspace.trim() &&
        !/\${workspaceFolder}|\${workspaceRoot}/.test(toolsGopathForWorkspace)) {
        return toolsGopathForWorkspace;
    }
    // If any of the folders in multi root have toolsGopath set, use it.
    for (const folder of vscode.workspace.workspaceFolders) {
        let toolsGopathFromConfig = exports.getGoConfig(folder.uri).inspect('toolsGopath').workspaceFolderValue;
        toolsGopathFromConfig = resolvePath(toolsGopathFromConfig, folder.uri.fsPath);
        if (toolsGopathFromConfig) {
            return toolsGopathFromConfig;
        }
    }
}
let currentGopath = '';
function getCurrentGoPath(workspaceUri) {
    const activeEditorUri = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri;
    const currentFilePath = goPath_1.fixDriveCasingInWindows(activeEditorUri && activeEditorUri.fsPath);
    const currentRoot = (workspaceUri && workspaceUri.fsPath) || getWorkspaceFolderPath(activeEditorUri);
    const config = exports.getGoConfig(workspaceUri || activeEditorUri);
    // Infer the GOPATH from the current root or the path of the file opened in current editor
    // Last resort: Check for the common case where GOPATH itself is opened directly in VS Code
    let inferredGopath;
    if (config['inferGopath'] === true) {
        inferredGopath = goPath_1.getInferredGopath(currentRoot) || goPath_1.getInferredGopath(currentFilePath);
        if (!inferredGopath) {
            try {
                if (fs.statSync(path.join(currentRoot, 'src')).isDirectory()) {
                    inferredGopath = currentRoot;
                }
            }
            catch (e) {
                // No op
            }
        }
        if (inferredGopath && process.env['GOPATH'] && inferredGopath !== process.env['GOPATH']) {
            inferredGopath += path.delimiter + process.env['GOPATH'];
        }
    }
    const configGopath = config['gopath'] ? resolvePath(substituteEnv(config['gopath']), currentRoot) : '';
    currentGopath = inferredGopath ? inferredGopath : configGopath || process.env['GOPATH'];
    return currentGopath;
}
exports.getCurrentGoPath = getCurrentGoPath;
function substituteEnv(input) {
    return input.replace(/\${env:([^}]+)}/g, (match, capture) => {
        return process.env[capture.trim()] || '';
    });
}
exports.substituteEnv = substituteEnv;
exports.killTree = (processId) => {
    try {
        kill(processId, (err) => {
            if (err) {
                console.log(`Error killing process tree: ${err}`);
            }
        });
    }
    catch (err) {
        console.log(`Error killing process tree: ${err}`);
    }
};
function rmdirRecursive(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
            const relPath = path.join(dir, file);
            if (fs.lstatSync(relPath).isDirectory()) {
                rmdirRecursive(relPath);
            }
            else {
                try {
                    fs.unlinkSync(relPath);
                }
                catch (err) {
                    console.log(`failed to remove ${relPath}: ${err}`);
                }
            }
        });
        fs.rmdirSync(dir);
    }
}
exports.rmdirRecursive = rmdirRecursive;
let tmpDir;
/**
 * Returns file path for given name in temp dir
 * @param name Name of the file
 */
function getTempFilePath(name) {
    if (!tmpDir) {
        tmpDir = fs.mkdtempSync(os.tmpdir() + path.sep + 'vscode-go');
    }
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }
    return path.normalize(path.join(tmpDir, name));
}
exports.getTempFilePath = getTempFilePath;
/**
 * Returns a boolean whether the current position lies within a comment or not
 * @param document
 * @param position
 */
function isPositionInComment(document, position) {
    const lineText = document.lineAt(position.line).text;
    const commentIndex = lineText.indexOf('//');
    if (commentIndex >= 0 && position.character > commentIndex) {
        const commentPosition = new vscode.Position(position.line, commentIndex);
        const isCommentInString = isPositionInString(document, commentPosition);
        return !isCommentInString;
    }
    return false;
}
exports.isPositionInComment = isPositionInComment;
function isPositionInString(document, position) {
    const lineText = document.lineAt(position.line).text;
    const lineTillCurrentPosition = lineText.substr(0, position.character);
    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    const escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || []).length;
    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}
exports.isPositionInString = isPositionInString;
function byteOffsetAt(document, position) {
    const offset = document.offsetAt(position);
    const text = document.getText();
    return Buffer.byteLength(text.substr(0, offset));
}
exports.byteOffsetAt = byteOffsetAt;
// Takes a Go function signature like:
//     (foo, bar string, baz number) (string, string)
// and returns an array of parameter strings:
//     ["foo", "bar string", "baz string"]
// Takes care of balancing parens so to not get confused by signatures like:
//     (pattern string, handler func(ResponseWriter, *Request)) {
function getParametersAndReturnType(signature) {
    const params = [];
    let parenCount = 0;
    let lastStart = 1;
    for (let i = 1; i < signature.length; i++) {
        switch (signature[i]) {
            case '(':
                parenCount++;
                break;
            case ')':
                parenCount--;
                if (parenCount < 0) {
                    if (i > lastStart) {
                        params.push(signature.substring(lastStart, i));
                    }
                    return {
                        params,
                        returnType: i < signature.length - 1 ? signature.substr(i + 1) : ''
                    };
                }
                break;
            case ',':
                if (parenCount === 0) {
                    params.push(signature.substring(lastStart, i));
                    lastStart = i + 2;
                }
                break;
        }
    }
    return { params: [], returnType: '' };
}
exports.getParametersAndReturnType = getParametersAndReturnType;
function parseFilePrelude(text) {
    const lines = text.split('\n');
    const ret = { imports: [], pkg: null };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const pkgMatch = line.match(/^(\s)*package(\s)+(\w+)/);
        if (pkgMatch) {
            ret.pkg = { start: i, end: i, name: pkgMatch[3] };
        }
        if (line.match(/^(\s)*import(\s)+\(/)) {
            ret.imports.push({ kind: 'multi', start: i, end: -1, pkgs: [] });
        }
        else if (line.match(/^\s*import\s+"C"/)) {
            ret.imports.push({ kind: 'pseudo', start: i, end: i, pkgs: [] });
        }
        else if (line.match(/^(\s)*import(\s)+[^\(]/)) {
            ret.imports.push({ kind: 'single', start: i, end: i, pkgs: [] });
        }
        if (line.match(/^(\s)*(\/\*.*\*\/)*\s*\)/)) { // /* comments */
            if (ret.imports[ret.imports.length - 1].end === -1) {
                ret.imports[ret.imports.length - 1].end = i;
            }
        }
        else if (ret.imports.length) {
            if (ret.imports[ret.imports.length - 1].end === -1) {
                const importPkgMatch = line.match(/"([^"]+)"/);
                if (importPkgMatch) {
                    ret.imports[ret.imports.length - 1].pkgs.push(importPkgMatch[1]);
                }
            }
        }
        if (line.match(/^(\s)*(func|const|type|var)\s/)) {
            break;
        }
    }
    return ret;
}
exports.parseFilePrelude = parseFilePrelude;
/**
 * Runs `go doc` to get documentation for given symbol
 * @param cwd The cwd where the go doc process will be run
 * @param packagePath Either the absolute path or import path of the package.
 * @param symbol Symbol for which docs need to be found
 * @param token Cancellation token
 */
function runGodoc(cwd, packagePath, receiver, symbol, token) {
    if (!packagePath) {
        return Promise.reject(new Error('Package Path not provided'));
    }
    if (!symbol) {
        return Promise.reject(new Error('Symbol not provided'));
    }
    const goRuntimePath = getBinPath('go');
    if (!goRuntimePath) {
        return Promise.reject(new Error('Cannot find "go" binary. Update PATH or GOROOT appropriately'));
    }
    const getCurrentPackagePromise = path.isAbsolute(packagePath)
        ? goModules_1.getCurrentPackage(packagePath)
        : Promise.resolve(packagePath);
    return getCurrentPackagePromise.then((packageImportPath) => {
        return new Promise((resolve, reject) => {
            if (receiver) {
                receiver = receiver.replace(/^\*/, '');
                symbol = receiver + '.' + symbol;
            }
            const env = goEnv_1.toolExecutionEnvironment();
            const args = ['doc', '-c', '-cmd', '-u', packageImportPath, symbol];
            console.log(goRuntimePath, args);
            const p = cp.execFile(goRuntimePath, args, { env, cwd }, (err, stdout, stderr) => {
                if (err) {
                    return reject(err.message || stderr);
                }
                let doc = '';
                const godocLines = stdout.split('\n');
                if (!godocLines.length) {
                    return resolve(doc);
                }
                // Recent versions of Go have started to include the package statement
                // tht we dont need.
                if (godocLines[0].startsWith('package ')) {
                    godocLines.splice(0, 1);
                    if (!godocLines[0].trim()) {
                        godocLines.splice(0, 1);
                    }
                }
                // Skip trailing empty lines
                let lastLine = godocLines.length - 1;
                for (; lastLine > 1; lastLine--) {
                    if (godocLines[lastLine].trim()) {
                        break;
                    }
                }
                for (let i = 1; i <= lastLine; i++) {
                    if (godocLines[i].startsWith('    ')) {
                        doc += godocLines[i].substring(4) + '\n';
                    }
                    else if (!godocLines[i].trim()) {
                        doc += '\n';
                    }
                }
                return resolve(doc);
            });
            if (token) {
                token.onCancellationRequested(() => {
                    exports.killTree(p.pid);
                });
            }
        });
    });
}
exports.runGodoc = runGodoc;
/**
 * Guess the package name based on parent directory name of the given file
 *
 * Cases:
 * - dir 'go-i18n' -> 'i18n'
 * - dir 'go-spew' -> 'spew'
 * - dir 'kingpin' -> 'kingpin'
 * - dir 'go-expand-tilde' -> 'tilde'
 * - dir 'gax-go' -> 'gax'
 * - dir 'go-difflib' -> 'difflib'
 * - dir 'jwt-go' -> 'jwt'
 * - dir 'go-radix' -> 'radix'
 *
 * @param {string} filePath.
 */
function guessPackageNameFromFile(filePath) {
    return new Promise((resolve, reject) => {
        const goFilename = path.basename(filePath);
        if (goFilename === 'main.go') {
            return resolve(['main']);
        }
        const directoryPath = path.dirname(filePath);
        const dirName = path.basename(directoryPath);
        let segments = dirName.split(/[\.-]/);
        segments = segments.filter((val) => val !== 'go');
        if (segments.length === 0 || !/[a-zA-Z_]\w*/.test(segments[segments.length - 1])) {
            return reject();
        }
        const proposedPkgName = segments[segments.length - 1];
        fs.stat(path.join(directoryPath, 'main.go'), (err, stats) => {
            if (stats && stats.isFile()) {
                return resolve(['main']);
            }
            if (goFilename.endsWith('_test.go')) {
                return resolve([proposedPkgName, proposedPkgName + '_test']);
            }
            return resolve([proposedPkgName]);
        });
    });
}
exports.guessPackageNameFromFile = guessPackageNameFromFile;
function getModuleCache() {
    if (currentGopath) {
        return path.join(currentGopath.split(path.delimiter)[0], 'pkg', 'mod');
    }
}
exports.getModuleCache = getModuleCache;
function getFileArchive(document) {
    const fileContents = document.getText();
    return document.fileName + '\n' + Buffer.byteLength(fileContents, 'utf8') + '\n' + fileContents;
}
exports.getFileArchive = getFileArchive;
function killProcess(p) {
    if (p) {
        try {
            p.kill();
        }
        catch (e) {
            console.log('Error killing process: ' + e);
        }
    }
}
exports.killProcess = killProcess;
function makeMemoizedByteOffsetConverter(buffer) {
    const defaultValue = new avlTree_1.Node(0, 0); // 0 bytes will always be 0 characters
    const memo = new avlTree_1.NearestNeighborDict(defaultValue, avlTree_1.NearestNeighborDict.NUMERIC_DISTANCE_FUNCTION);
    return (byteOffset) => {
        const nearest = memo.getNearest(byteOffset);
        const byteDelta = byteOffset - nearest.key;
        if (byteDelta === 0) {
            return nearest.value;
        }
        let charDelta;
        if (byteDelta > 0) {
            charDelta = buffer.toString('utf8', nearest.key, byteOffset).length;
        }
        else {
            charDelta = -buffer.toString('utf8', byteOffset, nearest.key).length;
        }
        memo.insert(byteOffset, nearest.value + charDelta);
        return nearest.value + charDelta;
    };
}
exports.makeMemoizedByteOffsetConverter = makeMemoizedByteOffsetConverter;
//# sourceMappingURL=util.js.map