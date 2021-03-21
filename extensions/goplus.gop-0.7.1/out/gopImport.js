'use strict';
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
exports.addImport = exports.listPackages = exports.getTextEditForAddImport = void 0;
const vscode = require("vscode");
const gopPackages_1 = require("./gopPackages");
const gopInstallTools_1 = require("./gopInstallTools");
const goOutline_1 = require("./goOutline");
const util_1 = require("./util");
function getTextEditForAddImport(inputText, arg) {
    // Import name wasn't provided
    if (arg === undefined) {
        return null;
    }
    const { imports, pkg } = util_1.parseFilePrelude(inputText);
    if (imports.some((block) => block.pkgs.some((pkgpath) => pkgpath === arg))) {
        return [];
    }
    const multis = imports.filter((x) => x.kind === 'multi');
    const minusCgo = imports.filter((x) => x.kind !== 'pseudo');
    if (multis.length > 0) {
        // There is a multiple import declaration, add to the last one
        const lastImportSection = multis[multis.length - 1];
        if (lastImportSection.end === -1) {
            // For some reason there was an empty import section like `import ()`
            return [vscode.TextEdit.insert(new vscode.Position(lastImportSection.start + 1, 0), `import "${arg}"\n`)];
        }
        // Add import at the start of the block so that goimports/goreturns can order them correctly
        return [vscode.TextEdit.insert(new vscode.Position(lastImportSection.start + 1, 0), '\t"' + arg + '"\n')];
    }
    else if (minusCgo.length > 0) {
        // There are some number of single line imports, which can just be collapsed into a block import.
        const edits = [];
        edits.push(vscode.TextEdit.insert(new vscode.Position(minusCgo[0].start - 1, 0), 'import (\n\t"' + arg + '"\n'));
        minusCgo.forEach((element) => {
            const currentLine = vscode.window.activeTextEditor.document.lineAt(element.start - 1).text;
            const updatedLine = currentLine.replace(/^\s*import\s*/, '\t');
            edits.push(vscode.TextEdit.replace(new vscode.Range(element.start - 1, 0, element.start - 1, currentLine.length), updatedLine));
        });
        edits.push(vscode.TextEdit.insert(new vscode.Position(minusCgo[minusCgo.length - 1].end - 1, 0), ')\n'));
        return edits;
    }
    else if (pkg && pkg.start >= 0) {
        // There are no import declarations, but there is a package declaration
        return [vscode.TextEdit.insert(new vscode.Position(0, 0), '\nimport (\n\t"' + arg + '"\n)\n')];
    }
    else {
        // There are no imports and no package declaration - give up
        return [];
    }
}
exports.getTextEditForAddImport = getTextEditForAddImport;
const missingToolMsg = 'Missing tool: ';
function listPackages(excludeImportedPkgs = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const importedPkgs = excludeImportedPkgs && vscode.window.activeTextEditor
            ? yield getImports(vscode.window.activeTextEditor.document)
            : [];
        const pkgMap = yield gopPackages_1.getImportablePackages(vscode.window.activeTextEditor.document.fileName, true);
        const stdLibs = [];
        const nonStdLibs = [];
        pkgMap.forEach((value, key) => {
            if (importedPkgs.some((imported) => imported === key)) {
                return;
            }
            if (value.isStd) {
                stdLibs.push(key);
            }
            else {
                nonStdLibs.push(key);
            }
        });
        return [...stdLibs.sort(), ...nonStdLibs.sort()];
    });
}
exports.listPackages = listPackages;
/**
 * Returns the imported packages in the given file
 *
 * @param document TextDocument whose imports need to be returned
 * @returns Array of imported package paths wrapped in a promise
 */
function getImports(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            fileName: document.fileName,
            importsOption: goOutline_1.GoOutlineImportsOptions.Only,
            document
        };
        const symbols = yield goOutline_1.documentSymbols(options, null);
        if (!symbols || !symbols.length) {
            return [];
        }
        // import names will be of the form "math", so strip the quotes in the beginning and the end
        const imports = symbols[0].children
            .filter((x) => x.kind === vscode.SymbolKind.Namespace)
            .map((x) => x.name.substr(1, x.name.length - 2));
        return imports;
    });
}
function askUserForImport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packages = yield listPackages(true);
            return vscode.window.showQuickPick(packages);
        }
        catch (err) {
            if (typeof err === 'string' && err.startsWith(missingToolMsg)) {
                gopInstallTools_1.promptForMissingTool(err.substr(missingToolMsg.length));
            }
        }
    });
}
function addImport(arg) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found to add imports.');
        return;
    }
    const p = arg && arg.importPath ? Promise.resolve(arg.importPath) : askUserForImport();
    p.then((imp) => {
        if (!imp) {
            return;
        }
        const edits = getTextEditForAddImport(vscode.window.activeTextEditor.document.getText(), imp);
        if (edits && edits.length > 0) {
            const edit = new vscode.WorkspaceEdit();
            edit.set(editor.document.uri, edits);
            vscode.workspace.applyEdit(edit);
        }
    });
}
exports.addImport = addImport;
//# sourceMappingURL=gopImport.js.map