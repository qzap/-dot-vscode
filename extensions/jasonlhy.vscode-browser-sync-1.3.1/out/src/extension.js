'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const browserSync = require("browser-sync");
const BrowserSyncContentProvider_1 = require("./BrowserSyncContentProvider");
const SCHEME_NAME = 'JasonBrowserSync';
let runningBS = [];
function getBrowserSyncUri(uri, mode, port) {
    if (uri.scheme === SCHEME_NAME) {
        return uri;
    }
    return uri.with({
        scheme: SCHEME_NAME,
        path: uri.fsPath,
        query: port.toString(),
        fragment: mode
    });
}
let contentProvider;
function activate(context) {
    console.log('Congratulations, your extension "vscode-browser-sync" is now active!');
    contentProvider = new BrowserSyncContentProvider_1.default();
    vscode.workspace.registerTextDocumentContentProvider(SCHEME_NAME, contentProvider);
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.browserSyncServerAtPanel', () => startServer(true)));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.browserSyncServerInBrowser', () => startServer(false)));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.browserSyncProxyAtPanel', () => startProxy(true)));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.browserSyncProxyInBrowser', () => startProxy(false)));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.exitAll', exitAll));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.browserSyncRefreshSidePanel', refreshSidePanel));
}
exports.activate = activate;
function refreshSidePanel() {
    return __awaiter(this, void 0, void 0, function* () {
        // For most case, there will be only one side panel
        yield vscode.workspace.saveAll();
        for (const document of vscode.workspace.textDocuments) {
            if (document.uri.scheme === SCHEME_NAME) {
                contentProvider.update(document.uri);
            }
        }
    });
}
function openSidePanel(mode, port) {
    const editor = vscode.window.activeTextEditor;
    const doc = editor.document;
    let uri = getBrowserSyncUri(doc.uri, mode, port);
    vscode.commands
        .executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two)
        .then(s => console.log('done'), vscode.window.showErrorMessage);
}
function startServer(openAtPanel) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = vscode.window.activeTextEditor.document;
        let parentFolder = path.dirname(doc.uri.fsPath);
        let files = yield getWatchFiles(doc);
        // It must use absolute path
        // Canont use relatie path to the cwd such as ["./*.html"]
        // It autodetect the free port for you
        let bs = browserSync.create();
        let config = {
            files: files,
            server: {
                baseDir: parentFolder,
                directory: true
            }
        };
        adjustConfigWithSetting(vscode.workspace.rootPath, config, vscode.workspace.getConfiguration().get('browserSync.config'));
        if (openAtPanel) {
            config['open'] = false;
        }
        bs.init(config, function () {
            // I find this method under the debugger not inside the documentation
            let port = bs.getOption("port");
            let msg = "Estbalished server with port: " + port;
            vscode.window.showInformationMessage(msg);
            console.log(msg);
            if (openAtPanel) {
                openSidePanel("server", port);
            }
            runningBS.push(bs);
        });
    });
}
/**
 * Return the watching files in absolute path
 *
 * @param doc TextDocument of the active editor
 */
function getWatchFiles(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        let cwd, files;
        if (vscode.workspace.rootPath) {
            let detectList = yield vscode.window.showInputBox({
                placeHolder: "e.g. app/*.html|app/*.css",
                prompt: "Enter relative path of files to root folder separated by | to watch multiple locations",
            });
            if (detectList) {
                cwd = vscode.workspace.rootPath;
                files = detectList.split("|");
            }
            else {
                cwd = path.dirname(doc.uri.fsPath);
                let thisType = "*" + path.extname(doc.uri.fsPath);
                files = [thisType];
            }
        }
        else {
            cwd = path.dirname(doc.uri.fsPath);
            let thisType = "*" + path.extname(doc.uri.fsPath);
            files = [thisType];
        }
        return files.map(p => path.join(cwd, p));
    });
}
/**
 * Adjust the cofiguration of browser sync with setting.
 * @param config
 */
function adjustConfigWithSetting(cwd, config, bsConfig) {
    console.log("hello");
    // let bsConfig: {} = vscode.workspace.getConfiguration().get('browserSync.config');
    if (bsConfig && Object.keys(bsConfig)) {
        Object.assign(config, bsConfig);
        // let useRelativePath = vscode.workspace.getConfiguration().get('browserSync.config.useRelativePath');
        if (bsConfig["files"]) {
            if (Array.isArray(config["files"])) {
                let files = config["files"];
                config["files"] = files.map(p => path.resolve(cwd, p));
            }
            else {
                let file = config["files"];
                config["files"] = path.resolve(cwd, file);
            }
        }
    }
}
exports.adjustConfigWithSetting = adjustConfigWithSetting;
function getBaseURL() {
    return __awaiter(this, void 0, void 0, function* () {
        let inputURL = yield vscode.window.showInputBox({
            placeHolder: "e.g. http://localhost:3000/Home",
            prompt: "Please enter the URL you want to sync with the change of files",
        });
        console.log('inputURL: ' + inputURL);
        // only port number
        if (inputURL && inputURL.match(/^\d+$/)) {
            inputURL = "http://localhost:" + inputURL;
        }
        return inputURL;
    });
}
function startProxy(openAtPanel) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = vscode.window.activeTextEditor.document;
        let inputURL = yield getBaseURL();
        let files = yield getWatchFiles(doc);
        // It must use absolute path
        // Canont use relatie path to the cwd such as ["./*.html"]
        // It autodetect the free port for you
        let bs = browserSync.create();
        let config = {
            proxy: inputURL,
            files: files,
        };
        adjustConfigWithSetting(vscode.workspace.rootPath, config, vscode.workspace.getConfiguration().get('browserSync.config'));
        if (openAtPanel) {
            config['open'] = false;
        }
        bs.init(config, function () {
            // I find this method under the debugger not inside the documentation
            let port = bs.getOption("port");
            let msg = "Estbalished proxy with port: " + port;
            console.log(msg);
            vscode.window.showInformationMessage(msg);
            if (openAtPanel) {
                openSidePanel("proxy", port);
            }
            runningBS.push(bs);
        });
    });
}
function exitAll() {
    let promises = runningBS.map((bs) => new Promise((resolve, reject) => {
        setTimeout(() => {
            let port = bs.getOption("port");
            bs.exit();
            let msg = "Browser Sync server/proxy with port: " + port + " is closed";
            console.log(msg);
            resolve(msg);
        }, 3000);
    }));
    return Promise.all(promises);
}
// this method is called when your extension is deactivated
// Extension must return a Promise from deactivate() 
// if the cleanup process is asynchronous.
// An extension may return undefined from deactivate()
// if the cleanup runs synchronously.
function deactivate() {
    return exitAll();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map