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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const vscode_1 = require("vscode");
const path = require("path");
const fs = require("fs");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "splitscreen" is now active!');
    let relatedFile = new RelatedFiles();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerTextEditorCommand('extension.splitScreen3', (editor, edit) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        relatedFile.onOpenRelated(editor, edit, 3);
    });
    let disposable2 = vscode.commands.registerTextEditorCommand('extension.splitScreen2', (editor, edit) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        relatedFile.onOpenRelated(editor, edit, 2);
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class RelatedFiles {
    // constructor() {
    //   this.disposable = commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this);
    // }
    // public dispose() {
    //   if (this.disposable) {
    //     this.disposable.dispose();
    //   }
    // }
    onOpenRelated(editor, edit, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor || !editor.document || editor.document.isUntitled) {
                return;
            }
            if (editor.viewColumn !== vscode_1.ViewColumn.One) {
                vscode.window.showInformationMessage('SplitScreen only works if you are in the first group of tabs');
                return;
            }
            let relatedFile;
            let relatedCssFile;
            const fileName = editor.document.fileName;
            const extension = path.extname(fileName).toLowerCase();
            if (extension === '.html') {
                const [tsFile, jsFile, scssFile] = yield Promise.all([
                    this.relatedFileExists(fileName, '.ts'),
                    this.relatedFileExists(fileName, '.js'),
                    this.relatedFileExists(fileName, '.scss'),
                ]);
                if (tsFile) {
                    relatedFile = tsFile;
                }
                else if (jsFile) {
                    relatedFile = jsFile;
                }
                if (scssFile) {
                    relatedCssFile = scssFile;
                }
            }
            else if (extension === '.js' || extension === '.ts') {
                relatedFile = yield this.relatedFileExists(fileName, '.html');
                relatedCssFile = yield this.relatedFileExists(fileName, '.scss');
            }
            else if (extension === '.vue') {
                // Unfold all
                yield vscode_1.commands.executeCommand('editor.unfoldAll');
                // <template>
                let currentEditor = this.getEditorByFileAndView(fileName, vscode_1.ViewColumn.One);
                if (currentEditor) {
                    let [lineTemplate, lineScript, lineStyle] = this.getVueLineNumbers(currentEditor);
                    yield this.foldLine(currentEditor, lineTemplate);
                    yield this.foldLine(currentEditor, lineStyle);
                    yield this.gotoLine(currentEditor, lineScript);
                    // <script>
                    yield vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(fileName), vscode_1.ViewColumn.Two);
                    currentEditor = this.getEditorByFileAndView(fileName, vscode_1.ViewColumn.Two);
                    if (currentEditor) {
                        let [lineTemplate, lineScript, lineStyle] = this.getVueLineNumbers(currentEditor);
                        yield this.foldLine(currentEditor, lineScript);
                        yield this.foldLine(currentEditor, lineStyle);
                        yield this.gotoLine(currentEditor, lineTemplate);
                        vscode.window.showInformationMessage('Your files, perfectly organized. Now write code. ');
                    }
                    // <style>
                    if (count === 3) {
                        yield vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(fileName), vscode_1.ViewColumn.Three);
                        currentEditor = this.getEditorByFileAndView(fileName, vscode_1.ViewColumn.Three);
                        if (currentEditor) {
                            let [lineTemplate, lineScript, lineStyle] = this.getVueLineNumbers(currentEditor);
                            yield this.foldLine(currentEditor, lineScript);
                            yield this.foldLine(currentEditor, lineTemplate);
                            yield this.gotoLine(currentEditor, lineStyle);
                        }
                    }
                }
            }
            if (relatedFile) {
                vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(relatedFile), vscode_1.ViewColumn.Two);
                vscode.window.showInformationMessage('Your files, perfectly organized. Now write some code');
            }
            if (relatedCssFile && count === 3) {
                vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(relatedCssFile), vscode_1.ViewColumn.Three);
            }
        });
    }
    relatedFileExists(fullPath, relatedExt) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${path.basename(fullPath, path.extname(fullPath))}${relatedExt}`;
            fullPath = path.join(path.dirname(fullPath), fileName);
            return new Promise((resolve, reject) => fs.access(fullPath, fs.constants.R_OK, err => resolve(err ? undefined : fullPath)));
        });
    }
    gotoLine(editor, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                return;
            }
            if (lineNumber === null) {
                return;
            }
            let range = editor.document.lineAt(lineNumber).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range);
            yield vscode_1.commands.executeCommand('editor.unfold');
            return;
        });
    }
    foldLine(editor, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor) {
                return;
            }
            if (lineNumber === null) {
                return;
            }
            let range = editor.document.lineAt(lineNumber).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range);
            yield vscode_1.commands.executeCommand('editor.fold');
            return;
        });
    }
    getVueLineNumbers(editor) {
        var content = editor.document.getText();
        if (content.length) {
            let lineTemplate = null;
            let lineScript = null;
            let lineStyle = null;
            let arr = content.split('\n');
            arr.forEach((l, i) => {
                if (l.indexOf('<template>') !== -1) {
                    lineTemplate = i;
                }
                else if (l.indexOf('<script>') !== -1) {
                    lineScript = i;
                }
                else if (l.indexOf('<style') !== -1) {
                    lineStyle = i;
                }
            });
            return [lineTemplate, lineScript, lineStyle];
        }
        return [null, null, null];
    }
    getEditorByFileAndView(fileName, viewColumn) {
        return vscode.window.visibleTextEditors.find(x => x.viewColumn === viewColumn && x.document.fileName === fileName);
    }
}
//# sourceMappingURL=extension.js.map