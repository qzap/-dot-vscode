'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const gopSuggest_1 = require("./gopSuggest");
const gopMode_1 = require("./gopMode");
const gopFormat_1 = require("./gopFormat");
const gopExtraInfo_1 = require("./gopExtraInfo");
const goDeclaration_1 = require("./goDeclaration");
const gopImport_1 = require("./gopImport");
function activate(ctx) {
    vscode.languages.registerCompletionItemProvider(gopMode_1.GOP_MODE, new gopSuggest_1.GoPlusCompletionItemProvider(ctx.globalState), '.', '"');
    vscode.languages.registerDocumentFormattingEditProvider(gopMode_1.GOP_MODE, new gopFormat_1.GoPlusDocumentFormattingEditProvider());
    vscode.languages.registerHoverProvider(gopMode_1.GOP_MODE, new gopExtraInfo_1.GoHoverProvider());
    vscode.languages.registerDefinitionProvider(gopMode_1.GOP_MODE, new goDeclaration_1.GoDefinitionProvider());
    vscode.commands.registerCommand('goplus.import.add', (arg) => {
        return gopImport_1.addImport(arg);
    });
}
exports.activate = activate;
//# sourceMappingURL=gopMain.js.map