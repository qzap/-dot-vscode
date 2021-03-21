"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const main_1 = require("./server/main");
const asset_resolver_1 = require("./asset-resolver");
const watcher_1 = require("./vscode/watcher");
const modifier_1 = require("./vscode/modifier");
const vue_file_repository_1 = require("./repositories/vue-file-repository");
const setting_repository_1 = require("./repositories/setting-repository");
const editor_repository_1 = require("./repositories/editor-repository");
const vue_file_1 = require("./parser/vue-file");
const subject_1 = require("./infra/communication/subject");
const connect_1 = require("./infra/communication/connect");
const logger_1 = require("./infra/communication/logger");
const mutator_1 = require("./server/mutator");
const resolver_1 = require("./server/resolver");
function createVSCodeWatcher(rootPath, setting) {
    return new watcher_1.Watcher(rootPath, setting.sharedStylePaths);
}
function createSettingRepository(rootPath) {
    const config = vscode.workspace.getConfiguration('vueDesigner');
    const repo = new setting_repository_1.SettingRepository(config, {
        readFile(filePath) {
            return __awaiter(this, void 0, void 0, function* () {
                const uri = vscode.Uri.file(path.join(rootPath, filePath));
                const document = yield vscode.workspace.openTextDocument(uri);
                return document.getText();
            });
        }
    });
    return repo;
}
function createVueFileRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        const uris = (yield vscode.workspace.findFiles('**/*.vue', '**/node_modules/**')).map(uri => uri.toString());
        const repo = yield vue_file_repository_1.VueFileRepository.create(uris, {
            readFile(rawUri) {
                return __awaiter(this, void 0, void 0, function* () {
                    const uri = vscode.Uri.parse(rawUri);
                    const document = yield vscode.workspace.openTextDocument(uri);
                    return document.getText();
                });
            },
            modifyFile(uri, modifiers) {
                return modifier_1.applyModifiers(uri, modifiers);
            }
        });
        return repo;
    });
}
function createEditorRepository(vueFiles) {
    const activeEditor = vscode.window.activeTextEditor;
    const activeDocumentUrl = activeEditor && activeEditor.document.uri.toString();
    return new editor_repository_1.EditorRepository(activeDocumentUrl, vueFiles, {
        highlight(uri, ranges) {
            const editor = vscode.window.visibleTextEditors.find(e => {
                return e.document.uri.toString() === uri;
            });
            if (!editor) {
                return;
            }
            const highlightList = ranges.map(range => {
                const start = editor.document.positionAt(range[0]);
                const end = editor.document.positionAt(range[1]);
                return new vscode.Range(start, end);
            });
            const currentHighlight = createHighlight();
            editor.setDecorations(currentHighlight, highlightList);
            return currentHighlight;
        }
    });
}
function createHighlight() {
    return vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(200, 200, 200, 0.2)'
    });
}
function connectToSubject(subject, watcher, assetResolver, vueFiles, setting, editor) {
    const vueFileToPayload = (vueFile) => {
        return vue_file_1.vueFileToPayload(vueFile, assetResolver);
    };
    const notifySaveVueFileByUri = (uri) => __awaiter(this, void 0, void 0, function* () {
        const vueFile = yield vueFiles.read(uri.toString());
        subject.notify('saveDocument', {
            vueFile: vueFileToPayload(vueFile)
        });
    });
    vueFiles.on('update', vueFile => {
        subject.notify('saveDocument', {
            vueFile: vueFileToPayload(vueFile)
        });
    });
    // Since editing component will be happened in high frequency
    // we need to debounce the notification to avoid high load.
    watcher.onDidEditComponent(lodash_debounce_1.default(notifySaveVueFileByUri, 200));
    watcher.onDidCreateComponent(notifySaveVueFileByUri);
    watcher.onDidChangeComponent(notifySaveVueFileByUri);
    watcher.onDidDeleteComponent(uri => {
        const uriStr = uri.toString();
        vueFiles.delete(uriStr);
        subject.notify('removeDocument', { uri: uriStr });
    });
    watcher.onDidChangeSharedStyle(() => __awaiter(this, void 0, void 0, function* () {
        subject.notify('initSharedStyle', {
            style: yield setting.readSharedStyle()
        });
    }));
    watcher.onDidSwitchComponent(uri => {
        editor.activeDocumentUrl = uri.toString();
        subject.notify('changeActiveDocument', { uri: editor.activeDocumentUrl });
    });
}
function getWebViewContent(port) {
    return `<style>
  html, body, iframe {
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    border-width: 0;
    background-color: #fff;
  }
  </style>
  <body>
    <iframe src="http://localhost:${port}" sandbox="allow-scripts"></iframe>
  </body>`;
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const folders = vscode.workspace.workspaceFolders;
        const rootFolder = folders && folders[0].uri.fsPath;
        if (!rootFolder)
            return;
        const setting = createSettingRepository(rootFolder);
        const watcher = createVSCodeWatcher(rootFolder, setting);
        const vueFiles = yield createVueFileRepository();
        const editor = createEditorRepository(vueFiles);
        const assetResolver = new asset_resolver_1.AssetResolver();
        const server = main_1.startStaticServer(assetResolver);
        const wsServer = logger_1.enableLogging(main_1.startWebSocketServer(server));
        const subject = new subject_1.Subject(wsServer);
        connect_1.connectWsServer({
            resolver: resolver_1.resolver(vueFiles, setting, editor, assetResolver),
            mutator: mutator_1.mutator(vueFiles, editor),
            server: wsServer
        });
        connectToSubject(subject, watcher, assetResolver, vueFiles, setting, editor);
        const serverPort = process.env.DEV
            ? 50000
            : server.address().port;
        console.log(`Vue Designer server listening at http://localhost:${serverPort}`);
        const disposable = vscode.commands.registerCommand('extension.openVueDesigner', () => {
            const panel = vscode.window.createWebviewPanel('vueDesigner', 'Vue Designer', vscode.ViewColumn.Two, {
                enableScripts: true
            });
            panel.webview.html = getWebViewContent(serverPort);
        });
        context.subscriptions.push(disposable, {
            dispose: () => server.close()
        }, {
            dispose: () => watcher.destroy()
        }, {
            dispose: () => vueFiles.destroy()
        });
    });
}
exports.activate = activate;
