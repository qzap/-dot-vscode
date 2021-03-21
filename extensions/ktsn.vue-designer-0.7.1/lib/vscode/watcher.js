"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class Watcher extends vscode.Disposable {
    constructor(rootPath, sharedStyleUris) {
        super(() => {
            this.innerWatcher.dispose();
        });
        this.sharedStyleUris = sharedStyleUris.map(stylePath => {
            return vscode.Uri.file(path.join(rootPath, stylePath));
        });
        const pattern = new vscode.RelativePattern(rootPath, '**/*.{vue,css}');
        this.innerWatcher = vscode.workspace.createFileSystemWatcher(pattern);
    }
    onDidSwitchComponent(fn) {
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && path.extname(editor.document.uri.fsPath) === '.vue') {
                fn(editor.document.uri);
            }
        });
    }
    onDidEditComponent(fn) {
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document !== vscode.window.activeTextEditor.document) {
                return;
            }
            const uri = event.document.uri;
            this.createVueListener(fn)(uri);
        });
    }
    onDidCreateComponent(fn) {
        this.innerWatcher.onDidCreate(this.createVueListener(fn));
    }
    onDidChangeComponent(fn) {
        this.innerWatcher.onDidChange(this.createVueListener(fn));
    }
    onDidDeleteComponent(fn) {
        this.innerWatcher.onDidDelete(fn);
    }
    onDidChangeSharedStyle(fn) {
        const uris = this.sharedStyleUris.map(uri => uri.toString());
        const interpolate = (uri) => {
            if (uris.indexOf(uri.toString()) >= 0) {
                fn();
            }
        };
        const w = this.innerWatcher;
        w.onDidCreate(interpolate);
        w.onDidChange(interpolate);
        w.onDidDelete(interpolate);
    }
    destroy() {
        this.innerWatcher.dispose();
    }
    createVueListener(fn) {
        return uri => {
            if (path.extname(uri.fsPath) !== '.vue') {
                return;
            }
            vscode.workspace.openTextDocument(uri).then(doc => {
                fn(uri, doc);
            });
        };
    }
}
exports.Watcher = Watcher;
