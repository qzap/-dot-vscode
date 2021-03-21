'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tsserverlibrary = _interopDefault(require('typescript/lib/tsserverlibrary'));
var _package = _interopDefault(require('typescript-deno-plugin/package.json'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var vscodeLanguageserver = _interopDefault(require('vscode-languageserver'));
var vscodeLanguageserverTextdocument = _interopDefault(require('vscode-languageserver-textdocument'));
var stream = _interopDefault(require('stream'));
var execa = _interopDefault(require('execa'));
var vscodeUri = _interopDefault(require('vscode-uri'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var args = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHelpMessage = exports.parseArguments = void 0;
function parseString(args, argName) {
    const index = args.indexOf(argName);
    if (index < 0 || index === args.length - 1) {
        return;
    }
    return args[index + 1];
}
function parseBoolen(args, argName) {
    return args.includes(argName);
}
function parseArguments(args) {
    return {
        help: parseBoolen(args, "--help"),
        logFile: parseString(args, "--logFile"),
        logVerbosity: parseString(args, "--logVerbosity"),
        config: parseString(args, "--config"),
        importmap: parseString(args, "--importmap"),
    };
}
exports.parseArguments = parseArguments;
function generateHelpMessage(args) {
    return `Deno Language Service that implements the Language Server Protocol (LSP).

  Usage: ${args[0]} ${args[1]} [options]

  Options:
    --help: Prints help message.
    --logFile: Location to log messages. Logging is disabled if not provided.
    --logVerbosity: terse|normal|verbose|requestTime. See ts.server.LogLevel.
    --config: Path of config.json.
    --importmap: Path of import maps.

  Additional options supported by vscode-languageserver:
    --clientProcessId=<number>: Automatically kills the server if the client process dies.
    --node-ipc: Communicate using Node's IPC. This is the default.
    --stdio: Communicate over stdin/stdout.
    --socket=<number>: Communicate using Unix socket.
  `;
}
exports.generateHelpMessage = generateHelpMessage;

});

unwrapExports(args);
var args_1 = args.generateHelpMessage;
var args_2 = args.parseArguments;

var logger = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright Google Inc. and other 'vscode-ng-language-service' contributors. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file at https://angular.io/license
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.createLogger = void 0;
const fs$1 = __importStar(fs);
const path$1 = __importStar(path);
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
/**
 * Create a logger instance to write to file.
 * @param options Logging options.
 */
function createLogger(options) {
    let logLevel;
    switch (options.logVerbosity) {
        case "requestTime":
            logLevel = tsserverlibrary_1.default.server.LogLevel.requestTime;
            break;
        case "verbose":
            logLevel = tsserverlibrary_1.default.server.LogLevel.verbose;
            break;
        case "normal":
            logLevel = tsserverlibrary_1.default.server.LogLevel.normal;
            break;
        case "terse":
        default:
            logLevel = tsserverlibrary_1.default.server.LogLevel.terse;
            break;
    }
    // If logFile is not provided then just trace to console.
    const traceToConsole = !options.logFile;
    return new Logger(traceToConsole, logLevel, options.logFile);
}
exports.createLogger = createLogger;
// TODO: Code below is from TypeScript's repository. Maybe create our own
// implementation.
// https://github.com/microsoft/TypeScript/blob/ec39d412876d0dcf704fc886d5036cb625220d2f/src/tsserver/server.ts#L120
function noop(_) { } // tslint:disable-line no-empty
function nowString() {
    // E.g. "12:34:56.789"
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}
class Logger {
    constructor(traceToConsole, level, logFilename) {
        this.traceToConsole = traceToConsole;
        this.level = level;
        this.logFilename = logFilename;
        this.fd = -1;
        this.seq = 0;
        this.inGroup = false;
        this.firstInGroup = true;
        if (logFilename) {
            try {
                const dir = path$1.dirname(logFilename);
                if (!fs$1.existsSync(dir)) {
                    fs$1.mkdirSync(dir);
                }
                this.fd = fs$1.openSync(logFilename, "w");
            }
            catch (_a) {
                // swallow the error and keep logging disabled if file cannot be opened
            }
        }
    }
    static padStringRight(str, padding) {
        return (str + padding).slice(0, padding.length);
    }
    close() {
        if (this.fd >= 0) {
            fs$1.close(this.fd, noop);
        }
    }
    getLogFileName() {
        return this.logFilename;
    }
    perftrc(s) {
        this.msg(s, tsserverlibrary_1.default.server.Msg.Perf);
    }
    info(s) {
        this.msg(s, tsserverlibrary_1.default.server.Msg.Info);
    }
    err(s) {
        this.msg(s, tsserverlibrary_1.default.server.Msg.Err);
    }
    startGroup() {
        this.inGroup = true;
        this.firstInGroup = true;
    }
    endGroup() {
        this.inGroup = false;
    }
    loggingEnabled() {
        return !!this.logFilename || this.traceToConsole;
    }
    hasLevel(level) {
        return this.loggingEnabled() && this.level >= level;
    }
    msg(s, type = tsserverlibrary_1.default.server.Msg.Err) {
        if (!this.canWrite)
            return;
        s = `[${nowString()}] ${s}\n`;
        if (!this.inGroup || this.firstInGroup) {
            const prefix = Logger.padStringRight(type + " " + this.seq.toString(), "          ");
            s = prefix + s;
        }
        this.write(s);
        if (!this.inGroup) {
            this.seq++;
        }
    }
    get canWrite() {
        return this.fd >= 0 || this.traceToConsole;
    }
    write(s) {
        if (this.fd >= 0) {
            const buf = Buffer.from(s);
            // tslint:disable-next-line no-null-keyword
            fs$1.writeSync(this.fd, buf, 0, buf.length, /*position*/ null); // TODO: GH#18217
        }
        if (this.traceToConsole) {
            console.warn(s);
        }
    }
}
exports.Logger = Logger;

});

unwrapExports(logger);
var logger_1 = logger.Logger;
var logger_2 = logger.createLogger;

var server_host = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright Google Inc. and other 'vscode-ng-language-service' contributors. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file at https://angular.io/license
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerHost = void 0;
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
/**
 * `ServerHost` is a wrapper around `ts.sys` for the Node system. In Node, all
 * optional methods of `ts.System` are implemented.
 * See
 * https://github.com/microsoft/TypeScript/blob/ec39d412876d0dcf704fc886d5036cb625220d2f/src/compiler/sys.ts#L716
 */
class ServerHost {
    constructor() {
        this.args = tsserverlibrary_1.default.sys.args;
        this.newLine = tsserverlibrary_1.default.sys.newLine;
        this.useCaseSensitiveFileNames = tsserverlibrary_1.default.sys.useCaseSensitiveFileNames;
    }
    write(s) {
        tsserverlibrary_1.default.sys.write(s);
    }
    writeOutputIsTTY() {
        return tsserverlibrary_1.default.sys.writeOutputIsTTY();
    }
    readFile(path, encoding) {
        return tsserverlibrary_1.default.sys.readFile(path, encoding);
    }
    getFileSize(path) {
        return tsserverlibrary_1.default.sys.getFileSize(path);
    }
    writeFile(path, data, writeByteOrderMark) {
        return tsserverlibrary_1.default.sys.writeFile(path, data, writeByteOrderMark);
    }
    /**
     * @pollingInterval - this parameter is used in polling-based watchers and
     * ignored in watchers that use native OS file watching
     */
    watchFile(path, callback, pollingInterval) {
        return tsserverlibrary_1.default.sys.watchFile(path, callback, pollingInterval);
    }
    watchDirectory(path, callback, recursive) {
        return tsserverlibrary_1.default.sys.watchDirectory(path, callback, recursive);
    }
    resolvePath(path) {
        return tsserverlibrary_1.default.sys.resolvePath(path);
    }
    fileExists(path) {
        return tsserverlibrary_1.default.sys.fileExists(path);
    }
    directoryExists(path) {
        return tsserverlibrary_1.default.sys.directoryExists(path);
    }
    createDirectory(path) {
        return tsserverlibrary_1.default.sys.createDirectory(path);
    }
    getExecutingFilePath() {
        return tsserverlibrary_1.default.sys.getExecutingFilePath();
    }
    getCurrentDirectory() {
        return tsserverlibrary_1.default.sys.getCurrentDirectory();
    }
    getDirectories(path) {
        return tsserverlibrary_1.default.sys.getDirectories(path);
    }
    readDirectory(path, extensions, exclude, include, depth) {
        return tsserverlibrary_1.default.sys.readDirectory(path, extensions, exclude, include, depth);
    }
    getModifiedTime(path) {
        return tsserverlibrary_1.default.sys.getModifiedTime(path);
    }
    setModifiedTime(path, time) {
        return tsserverlibrary_1.default.sys.setModifiedTime(path, time);
    }
    deleteFile(path) {
        return tsserverlibrary_1.default.sys.deleteFile(path);
    }
    /**
     * A good implementation is node.js' `crypto.createHash`.
     * (https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)
     */
    createHash(data) {
        return tsserverlibrary_1.default.sys.createHash(data);
    }
    /**
     * This must be cryptographically secure. Only implement this method using
     * `crypto.createHash("sha256")`.
     */
    createSHA256Hash(data) {
        return tsserverlibrary_1.default.sys.createSHA256Hash(data);
    }
    getMemoryUsage() {
        return tsserverlibrary_1.default.sys.getMemoryUsage();
    }
    exit(exitCode) {
        return tsserverlibrary_1.default.sys.exit(exitCode);
    }
    realpath(path) {
        return tsserverlibrary_1.default.sys.realpath(path);
    }
    setTimeout(callback, ms, ...args) {
        return tsserverlibrary_1.default.sys.setTimeout(callback, ms, ...args);
    }
    clearTimeout(timeoutId) {
        return tsserverlibrary_1.default.sys.clearTimeout(timeoutId);
    }
    clearScreen() {
        return tsserverlibrary_1.default.sys.clearScreen();
    }
    base64decode(input) {
        return tsserverlibrary_1.default.sys.base64decode(input);
    }
    base64encode(input) {
        return tsserverlibrary_1.default.sys.base64encode(input);
    }
    setImmediate(callback, ...args) {
        return setImmediate(callback, ...args);
    }
    clearImmediate(timeoutId) {
        return clearImmediate(timeoutId);
    }
    require(initialPath, moduleName) {
        try {
            const modulePath = commonjsRequire.resolve(moduleName, {
                paths: [initialPath],
            });
            return {
                module: commonjsRequire(modulePath),
                error: undefined,
            };
        }
        catch (e) {
            return {
                module: undefined,
                error: e,
            };
        }
    }
}
exports.ServerHost = ServerHost;

});

unwrapExports(server_host);
var server_host_1 = server_host.ServerHost;

var project_service = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright Google Inc. and other 'vscode-ng-language-service' contributors. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file at https://angular.io/license
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
/**
 * NOTE:
 * There are three types of `project`:
 * 1. Configured project - basically all source files that belong to a tsconfig
 * 2. Inferred project - other files that do not belong to a tsconfig
 * 3. External project - not used in this context
 * For more info, see link below.
 * https://github.com/Microsoft/TypeScript/wiki/Standalone-Server-%28tsserver%29#project-system
 */
/**
 * `ProjectService` is a singleton service for the entire lifespan of the
 * language server. This specific implementation is a very thin wrapper
 * around TypeScript's `ProjectService`. On creation, it spins up tsserver and
 * loads `typescript-deno-plugin` as a global plugin.
 * `ProjectService` is used to manage both TS document as well as HTML.
 * Using tsserver to handle non-TS files is fine as long as the ScriptKind is
 * configured correctly and `getSourceFile()` is never called on non-TS files.
 */
class ProjectService {
    constructor(options, denoPluginOptions) {
        options.logger.info("ProjectService");
        this.tsProjSvc = new tsserverlibrary_1.default.server.ProjectService(options);
        this.tsProjSvc.setHostConfiguration({
            hostInfo: "Deno Service",
            formatOptions: this.tsProjSvc.getHostFormatCodeOptions(),
            preferences: this.tsProjSvc.getHostPreferences(),
            extraFileExtensions: [
                {
                    extension: ".js",
                    isMixedContent: false,
                    scriptKind: tsserverlibrary_1.default.ScriptKind.JS,
                },
                {
                    extension: ".jsx",
                    isMixedContent: false,
                    scriptKind: tsserverlibrary_1.default.ScriptKind.JSX,
                },
                {
                    extension: ".ts",
                    isMixedContent: false,
                    scriptKind: tsserverlibrary_1.default.ScriptKind.TS,
                },
                {
                    extension: ".tsx",
                    isMixedContent: false,
                    scriptKind: tsserverlibrary_1.default.ScriptKind.TSX,
                },
            ],
        });
        this.tsProjSvc.configurePlugin({
            pluginName: "typescript-deno-plugin",
            configuration: denoPluginOptions,
        });
        const plugins = this.tsProjSvc.globalPlugins;
        options.logger.info("enable plugins: " + plugins.join(", "));
    }
    /**
     * Open file whose contents is managed by the client
     * @param filename is absolute pathname
     * @param fileContent is a known version of the file content that is more up to date than the one
     *     on disk
     */
    openClientFile(fileName, fileContent, scriptKind, projectRootPath) {
        return this.tsProjSvc.openClientFile(fileName, fileContent, scriptKind, projectRootPath);
    }
    /**
     * Close file whose contents is managed by the client
     * @param filename is absolute pathname
     */
    closeClientFile(uncheckedFileName) {
        this.tsProjSvc.closeClientFile(uncheckedFileName);
    }
    findProject(projectName) {
        return this.tsProjSvc.findProject(projectName);
    }
    getScriptInfo(uncheckedFileName) {
        return this.tsProjSvc.getScriptInfo(uncheckedFileName);
    }
    /**
     * Return the default project for the specified `scriptInfo` if it is already
     * a configured project. If not, attempt to find a relevant config file and
     * make that project its default. This method is to ensure HTML files always
     * belong to a configured project instead of the default behavior of being in
     * an inferred project.
     * @param scriptInfo
     */
    getDefaultProjectForScriptInfo(scriptInfo) {
        // TODO: If in Deno path, set ScriptInfo to ts.
        return this.tsProjSvc.getDefaultProjectForFile(scriptInfo.fileName, false);
    }
    /**
     * Returns a language service for a default project created for the specified `scriptInfo`. If the
     * project does not support a language service, nothing is returned.
     */
    getDefaultLanguageService(scriptInfo) {
        const project = this.getDefaultProjectForScriptInfo(scriptInfo);
        if (!(project === null || project === void 0 ? void 0 : project.languageServiceEnabled))
            return;
        return project.getLanguageService();
    }
}
exports.ProjectService = ProjectService;

});

unwrapExports(project_service);
var project_service_1 = project_service.ProjectService;

var protocol = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectLoadingNotification = void 0;

exports.projectLoadingNotification = {
    start: new vscodeLanguageserver.NotificationType0("deno-language-service/projectLoadingStart"),
    finish: new vscodeLanguageserver.NotificationType0("deno-language-service/projectLoadingFinish"),
};

});

unwrapExports(protocol);
var protocol_1 = protocol.projectLoadingNotification;

var deno = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright axetroy(铁手). All rights reserved. MIT license.
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.isDenoProject = void 0;

const execa_1 = __importDefault(execa);
/**
 * Return true if the specified `project` contains mod.ts file.
 * @param project
 * @param denoMod path that uniquely identifies `mod.ts`.
 */
function isDenoProject(project, denoMod) {
    return true;
    // TODO: @justjavac
    // project.markAsDirty(); // Must mark project as dirty to rebuild the program.
    // if (project.isNonTsProject()) {
    //   return false;
    // }
    // for (const fileName of project.getFileNames()) {
    //   if (fileName.endsWith(denoMod)) {
    //     return true;
    //   }
    // }
    // return false;
}
exports.isDenoProject = isDenoProject;
/**
 * format code using `deno fmt`
 *
 * ```shell
 * cat file.ts | deno fmt -
 * ```
 * @param code
 * @param cwd
 */
async function format(code) {
    const reader = stream.Readable.from([code]);
    const subprocess = execa_1.default("deno", ["fmt", "-"], {
        stdout: "pipe",
        stderr: "pipe",
        stdin: "pipe",
    });
    return new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        subprocess.on("exit", (exitCode) => {
            if (exitCode !== 0) {
                reject(new Error(stderr));
            }
            else {
                resolve(stdout);
            }
        });
        subprocess.on("error", (err) => {
            reject(err);
        });
        subprocess.stdout.on("data", (data) => {
            stdout += data;
        });
        subprocess.stderr.on("data", (data) => {
            stderr += data;
        });
        subprocess.stdin && reader.pipe(subprocess.stdin);
    });
}
exports.format = format;

});

unwrapExports(deno);
var deno_1 = deno.format;
var deno_2 = deno.isDenoProject;

var utils = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright Google Inc. and other 'vscode-ng-language-service' contributors. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file at https://angular.io/license
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsDiagnosticToLspDiagnostic = exports.lspRangeToTsPositions = exports.lspPositionToTsPosition = exports.tsTextSpanToLspRange = exports.filePathToUri = exports.uriToFilePath = void 0;
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
const lsp = __importStar(vscodeLanguageserver);

var Scheme;
(function (Scheme) {
    Scheme["File"] = "file";
})(Scheme || (Scheme = {}));
/**
 * Extract the file path from the specified `uri`.
 * @param uri
 */
function uriToFilePath(uri) {
    // Note: uri.path is different from uri.fsPath
    // See
    // https://github.com/microsoft/vscode-uri/blob/413805221cc6ed167186ab3103d3248d6f7161f2/src/index.ts#L622-L645
    const { scheme, fsPath } = vscodeUri.URI.parse(uri);
    if (scheme !== Scheme.File) {
        return "";
    }
    return fsPath;
}
exports.uriToFilePath = uriToFilePath;
/**
 * Converts the specified `filePath` to a proper URI.
 * @param filePath
 */
function filePathToUri(filePath) {
    return vscodeUri.URI.file(filePath).toString();
}
exports.filePathToUri = filePathToUri;
/**
 * Convert ts.TextSpan to lsp.TextSpan. TypeScript keeps track of offset using
 * 1-based index whereas LSP uses 0-based index.
 * @param scriptInfo Used to determine the offsets.
 * @param textSpan
 */
function tsTextSpanToLspRange(scriptInfo, textSpan) {
    const start = scriptInfo.positionToLineOffset(textSpan.start);
    const end = scriptInfo.positionToLineOffset(textSpan.start + textSpan.length);
    // ScriptInfo (TS) is 1-based, LSP is 0-based.
    return lsp.Range.create(start.line - 1, start.offset - 1, end.line - 1, end.offset - 1);
}
exports.tsTextSpanToLspRange = tsTextSpanToLspRange;
/**
 * Convert lsp.Position to the absolute offset in the file. LSP keeps track of
 * offset using 0-based index whereas TypeScript uses 1-based index.
 * @param scriptInfo Used to determine the offsets.
 * @param position
 */
function lspPositionToTsPosition(scriptInfo, position) {
    const { line, character } = position;
    // ScriptInfo (TS) is 1-based, LSP is 0-based.
    return scriptInfo.lineOffsetToPosition(line + 1, character + 1);
}
exports.lspPositionToTsPosition = lspPositionToTsPosition;
/**
 * Convert lsp.Range which is made up of `start` and `end` positions to
 * TypeScript's absolute offsets.
 * @param scriptInfo Used to determine the offsets.
 * @param range
 */
function lspRangeToTsPositions(scriptInfo, range) {
    const start = lspPositionToTsPosition(scriptInfo, range.start);
    const end = lspPositionToTsPosition(scriptInfo, range.end);
    return [start, end];
}
exports.lspRangeToTsPositions = lspRangeToTsPositions;
/**
 * Convert ts.DiagnosticCategory to lsp.DiagnosticSeverity
 * @param category diagnostic category
 */
function tsDiagnosticCategoryToLspDiagnosticSeverity(category) {
    switch (category) {
        case tsserverlibrary_1.default.DiagnosticCategory.Warning:
            return lsp.DiagnosticSeverity.Warning;
        case tsserverlibrary_1.default.DiagnosticCategory.Error:
            return lsp.DiagnosticSeverity.Error;
        case tsserverlibrary_1.default.DiagnosticCategory.Suggestion:
            return lsp.DiagnosticSeverity.Hint;
        case tsserverlibrary_1.default.DiagnosticCategory.Message:
        default:
            return lsp.DiagnosticSeverity.Information;
    }
}
/**
 * Convert ts.Diagnostic to lsp.Diagnostic
 * @param tsDiag TS diagnostic
 * @param scriptInfo Used to compute proper offset.
 */
function tsDiagnosticToLspDiagnostic(tsDiag, scriptInfo) {
    const textSpan = {
        start: tsDiag.start || 0,
        length: tsDiag.length || 0,
    };
    return lsp.Diagnostic.create(tsTextSpanToLspRange(scriptInfo, textSpan), tsserverlibrary_1.default.flattenDiagnosticMessageText(tsDiag.messageText, "\n"), tsDiagnosticCategoryToLspDiagnosticSeverity(tsDiag.category), tsDiag.code, tsDiag.source);
}
exports.tsDiagnosticToLspDiagnostic = tsDiagnosticToLspDiagnostic;

});

unwrapExports(utils);
var utils_1 = utils.tsDiagnosticToLspDiagnostic;
var utils_2 = utils.lspRangeToTsPositions;
var utils_3 = utils.lspPositionToTsPosition;
var utils_4 = utils.tsTextSpanToLspRange;
var utils_5 = utils.filePathToUri;
var utils_6 = utils.uriToFilePath;

var code_actions = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixItems = exports.DiagnosticCode = void 0;
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode[DiagnosticCode["InvalidRelativeImport"] = 10001] = "InvalidRelativeImport";
    DiagnosticCode[DiagnosticCode["RemoteModuleNotExist"] = 10002] = "RemoteModuleNotExist";
    DiagnosticCode[DiagnosticCode["LocalModuleNotExist"] = 10003] = "LocalModuleNotExist";
    DiagnosticCode[DiagnosticCode["InvalidImport"] = 10004] = "InvalidImport";
})(DiagnosticCode = exports.DiagnosticCode || (exports.DiagnosticCode = {}));
exports.FixItems = {
    [DiagnosticCode.LocalModuleNotExist]: {
        title: "Create the module",
        command: "deno._create_local_module",
    },
    [DiagnosticCode.RemoteModuleNotExist]: {
        title: "Cache the module from remote",
        command: "deno._fetch_remote_module",
    },
};

});

unwrapExports(code_actions);
var code_actions_1 = code_actions.FixItems;
var code_actions_2 = code_actions.DiagnosticCode;

var connection = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
// Copyright Google Inc. and other 'vscode-ng-language-service' contributors. All Rights Reserved.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file at https://angular.io/license
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
const lsp = __importStar(vscodeLanguageserver);



const deno$1 = __importStar(deno);


const LanguageTsIds = [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
];
// Empty definition range for files without `scriptInfo`
const EMPTY_RANGE = lsp.Range.create(0, 0, 0, 0);
/**
 * Connection is a wrapper around lsp.IConnection, with all the necessary protocol
 * handlers installed for Deno language service.
 */
class Connection {
    constructor(options) {
        this.diagnosticsTimeout = null;
        this.isProjectLoading = false;
        // Create a connection for the server. The connection uses Node's IPC as a transport.
        this.connection = lsp.createConnection();
        this.documents = new lsp.TextDocuments(vscodeLanguageserverTextdocument.TextDocument);
        this.serverName = options.serverName;
        this.addProtocolHandlers(this.connection);
        this.addDocumentHandlers(this.documents);
        this.projectService = new project_service.ProjectService({
            host: options.host,
            logger: options.logger,
            cancellationToken: tsserverlibrary_1.default.server.nullCancellationToken,
            useSingleInferredProject: true,
            useInferredProjectPerProjectRoot: true,
            typingsInstaller: tsserverlibrary_1.default.server.nullTypingsInstaller,
            // Not supressing diagnostic events can cause a type error to be thrown when the
            // language server session gets an event for a file that is outside the project
            // managed by the project service, and for which a program does not exist in the
            // corresponding project's language service.
            // See https://github.com/angular/vscode-ng-language-service/issues/693
            suppressDiagnosticEvents: true,
            eventHandler: (e) => this.handleProjectServiceEvent(e),
            globalPlugins: ["typescript-deno-plugin"],
            pluginProbeLocations: options.pluginProbeLocations,
            allowLocalPluginLoads: false,
        }, options.deno);
    }
    addProtocolHandlers(conn) {
        conn.onInitialize((p) => this.onInitialize(p));
        conn.onDidOpenTextDocument((p) => this.onDidOpenTextDocument(p));
        conn.onDidCloseTextDocument((p) => this.onDidCloseTextDocument(p));
        conn.onDidSaveTextDocument((p) => this.onDidSaveTextDocument(p));
        conn.onDocumentFormatting((p) => this.onDocumentFormatting(p));
        conn.onDocumentRangeFormatting((p) => this.onDocumentRangeFormatting(p));
        conn.onCodeAction((p) => this.onCodeAction(p));
    }
    /**
     * An event handler that gets invoked whenever the program changes and
     * TS ProjectService sends `ProjectUpdatedInBackgroundEvent`. This particular
     * event is used to trigger diagnostic checks.
     * @param event
     */
    handleProjectServiceEvent(event) {
        this.log("handleProjectServiceEvent");
        switch (event.eventName) {
            case tsserverlibrary_1.default.server.ProjectLoadingStartEvent:
                this.isProjectLoading = true;
                this.log("project loading");
                this.connection.sendNotification(protocol.projectLoadingNotification.start);
                break;
            case tsserverlibrary_1.default.server.ProjectLoadingFinishEvent: {
                const { project } = event.data;
                try {
                    // Disable language service if project is not Deno
                    this.checkIsDenoProject(project);
                }
                finally {
                    if (this.isProjectLoading) {
                        this.isProjectLoading = false;
                        this.log("project load finish");
                        this.connection.sendNotification(protocol.projectLoadingNotification.finish);
                    }
                }
                break;
            }
            case tsserverlibrary_1.default.server.ProjectsUpdatedInBackgroundEvent:
                // ProjectsUpdatedInBackgroundEvent is sent whenever diagnostics are
                // requested via project.refreshDiagnostics()
                this.triggerDiagnostics(event.data.openFiles);
                break;
        }
    }
    /**
     * Retrieve Deno diagnostics for the specified `openFiles` after a specific
     * `delay`, or renew the request if there's already a pending one.
     * @param openFiles
     * @param delay time to wait before sending request (milliseconds)
     */
    triggerDiagnostics(openFiles, delay = 200) {
        // Do not immediately send a diagnostics request. Send only after user has
        // stopped typing after the specified delay.
        if (this.diagnosticsTimeout) {
            // If there's an existing timeout, cancel it
            clearTimeout(this.diagnosticsTimeout);
        }
        // Set a new timeout
        this.diagnosticsTimeout = setTimeout(() => {
            this.diagnosticsTimeout = null; // clear the timeout
            this.sendPendingDiagnostics(openFiles);
            // Default delay is 200ms, consistent with TypeScript. See
            // https://github.com/microsoft/vscode/blob/7b944a16f52843b44cede123dd43ae36c0405dfd/extensions/typescript-language-features/src/features/bufferSyncSupport.ts#L493)
        }, delay);
    }
    /**
     * Execute diagnostics request for each of the specified `openFiles`.
     * @param openFiles
     */
    sendPendingDiagnostics(openFiles) {
        for (const fileName of openFiles) {
            const scriptInfo = this.projectService.getScriptInfo(fileName);
            if (!scriptInfo) {
                continue;
            }
            const tsLS = this.projectService.getDefaultLanguageService(scriptInfo);
            if (!tsLS) {
                continue;
            }
            const diagnostics = tsLS.getSemanticDiagnostics(fileName);
            // Need to send diagnostics even if it's empty otherwise editor state will
            // not be updated.
            this.connection.sendDiagnostics({
                uri: utils.filePathToUri(fileName),
                diagnostics: diagnostics.map((d) => utils.tsDiagnosticToLspDiagnostic(d, scriptInfo)),
            });
        }
    }
    onInitialize(params) {
        return {
            capabilities: {
                documentFormattingProvider: true,
                documentRangeFormattingProvider: true,
                textDocumentSync: {
                    openClose: true,
                    change: lsp.TextDocumentSyncKind.Full,
                },
                codeActionProvider: {
                    codeActionKinds: [lsp.CodeActionKind.QuickFix],
                },
            },
        };
    }
    onDidOpenTextDocument(params) {
        const { uri, languageId, text } = params.textDocument;
        this.log(`open ${uri}`);
        const filePath = utils.uriToFilePath(uri);
        if (!filePath) {
            return;
        }
        const scriptKind = LanguageTsIds.includes(languageId)
            ? tsserverlibrary_1.default.ScriptKind.TS
            : tsserverlibrary_1.default.ScriptKind.External;
        try {
            const result = this.projectService.openClientFile(filePath, text, scriptKind);
            const { configFileName, configFileErrors } = result;
            if (configFileErrors && configFileErrors.length) {
                // configFileErrors is an empty array even if there's no error, so check length.
                this.connection.console.error(configFileErrors.map((e) => e.messageText).join("\n"));
            }
            if (!configFileName) {
                this.connection.console.error(`No config file for ${filePath}`);
                return;
            }
            const project = this.projectService.findProject(configFileName);
            if (!project) {
                this.connection.console.error(`Failed to find project for ${filePath}`);
                return;
            }
            if (project.languageServiceEnabled) {
                project.refreshDiagnostics(); // Show initial diagnostics
            }
        }
        catch (error) {
            if (this.isProjectLoading) {
                this.isProjectLoading = false;
                this.connection.sendNotification(protocol.projectLoadingNotification.finish);
            }
            if (error.stack) {
                this.error(error.stack);
            }
            throw error;
        }
    }
    onDidCloseTextDocument(params) {
        const { textDocument } = params;
        const filePath = utils.uriToFilePath(textDocument.uri);
        if (!filePath) {
            return;
        }
        this.projectService.closeClientFile(filePath);
    }
    onDidSaveTextDocument(params) {
        const { text, textDocument } = params;
        const filePath = utils.uriToFilePath(textDocument.uri);
        const scriptInfo = this.projectService.getScriptInfo(filePath);
        if (!scriptInfo) {
            return;
        }
        if (text) {
            scriptInfo.open(text);
        }
        else {
            scriptInfo.reloadFromFile();
        }
    }
    async onDocumentFormatting(params) {
        const { textDocument } = params;
        const doc = this.documents.get(textDocument.uri);
        if (!doc) {
            return;
        }
        const text = doc.getText();
        const formatted = await deno$1.format(text);
        const start = doc.positionAt(0);
        const end = doc.positionAt(text.length);
        const range = lsp.Range.create(start, end);
        return [lsp.TextEdit.replace(range, formatted)];
    }
    async onDocumentRangeFormatting(params) {
        const { range, textDocument } = params;
        const doc = this.documents.get(textDocument.uri);
        if (!doc) {
            return;
        }
        const text = doc.getText(range);
        const formatted = await deno$1.format(text);
        // why trim it?
        // Because we are just formatting some of them, we don't need to keep the trailing \n
        return [lsp.TextEdit.replace(range, formatted.trim())];
    }
    async onCodeAction(params) {
        const { context, textDocument } = params;
        const diagnostics = context.diagnostics;
        if (diagnostics.length === 0) {
            return;
        }
        const actions = [];
        for (const diag of diagnostics) {
            if (!diag.code) {
                continue;
            }
            const item = code_actions.FixItems[diag.code];
            if (!item) {
                continue;
            }
            const action = lsp.CodeAction.create(`${item.title} (${this.serverName})`, lsp.Command.create(item.title, item.command, textDocument.uri, {
                start: {
                    line: diag.range.start.line,
                    character: diag.range.start.character,
                },
                end: {
                    line: diag.range.end.line,
                    character: diag.range.end.character,
                },
            }), lsp.CodeActionKind.QuickFix);
            actions.push(action);
        }
        return actions;
    }
    addDocumentHandlers(docs) {
        docs.onDidOpen((e) => this.onDidOpen(e));
    }
    onDidOpen(e) {
        this.log("Open file: " + e.document.uri);
        this.triggerDiagnostics([utils.uriToFilePath(e.document.uri)]);
    }
    /**
     * Show an error message.
     *
     * @param message The message to show.
     */
    error(message) {
        this.connection.console.error(message);
    }
    /**
     * Show a warning message.
     *
     * @param message The message to show.
     */
    warn(message) {
        this.connection.console.warn(message);
    }
    /**
     * Show an information message.
     *
     * @param message The message to show.
     */
    info(message) {
        this.connection.console.info(message);
    }
    /**
     * Log a message.
     *
     * @param message The message to log.
     */
    log(message) {
        this.connection.console.log(message);
    }
    /**
     * Start listening on the input stream for messages to process.
     */
    listen() {
        this.documents.listen(this.connection);
        this.connection.listen();
    }
    /**
     * Determine if the specified `project` is Deno, and disable the language
     * service if not.
     * @param project
     */
    checkIsDenoProject(project) {
        const DENO_MOD = "mod.ts";
        const { projectName } = project;
        if (!project.languageServiceEnabled) {
            const msg = `Language service is already disabled for ${projectName}. ` +
                `This could be due to non-TS files that exceeded the size limit (${tsserverlibrary_1.default.server.maxProgramSizeForNonTsFiles} bytes).` +
                `Please check log file for details.`;
            this.connection.console.info(msg); // log to remote console to inform users
            project.log(msg); // log to file, so that it's easier to correlate with ts entries
            return;
        }
        if (!deno$1.isDenoProject(project, DENO_MOD)) {
            project.disableLanguageService();
            const msg = `Disabling language service for ${projectName} because it is not an Deno project ` +
                `('${DENO_MOD}' could not be found). `;
            this.connection.console.info(msg);
            project.log(msg);
            return;
        }
        // The language service should be enabled at this point.
        this.connection.console.info(`Enabling language service for ${projectName}.`);
    }
}
exports.Connection = Connection;

});

unwrapExports(connection);
var connection_1 = connection.Connection;

var server = createCommonjsModule(function (module, exports) {
// Copyright 2019-2020 the Deno authors. All rights reserved. MIT license.
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsserverlibrary_1 = __importDefault(tsserverlibrary);
const package_json_1 = __importDefault(_package);




const serverName = "Deno Language Server";
process.title = serverName;
// Parse command line arguments
const options = args.parseArguments(process.argv);
if (options.help) {
    console.error(args.generateHelpMessage(process.argv));
    process.exit(0);
}
// Create a logger that logs to file. OK to emit verbose entries.
const logger$1 = logger.createLogger({
    logFile: options.logFile,
    logVerbosity: options.logVerbosity,
});
// ServerHost provides native OS functionality
const host = new server_host.ServerHost();
// Establish a new server that encapsulates lsp connection.
const connection$1 = new connection.Connection({
    serverName,
    host,
    logger: logger$1,
    deno: {
        tsconfig: options.config,
        importmap: options.importmap,
    },
});
// Log initialization info
connection$1.info(`Deno language server process ID: ${process.pid}.`);
connection$1.info(`Using typescript v${tsserverlibrary_1.default.version} from extension bundled.`);
connection$1.info(`Using typescript-deno-plugin v${package_json_1.default.version} from extension bundled.`);
connection$1.info(`Log file: ${logger$1.getLogFileName()}`);
if (process.env.Deno_DEBUG === "true") {
    connection$1.info("Deno Language Service is running under DEBUG mode.");
}
if (process.env.TSC_NONPOLLING_WATCHER !== "true") {
    connection$1.warn(`Using less efficient polling watcher. Set TSC_NONPOLLING_WATCHER to true.`);
}
connection$1.listen();

});

var server$1 = unwrapExports(server);

exports.default = server$1;
