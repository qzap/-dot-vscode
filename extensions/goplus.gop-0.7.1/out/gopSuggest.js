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
exports.GoPlusCompletionItemProvider = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const path = require("path");
const goEnv_1 = require("./goEnv");
const gopImport_1 = require("./gopImport");
const gopInstallTools_1 = require("./gopInstallTools");
const gopPackages_1 = require("./gopPackages");
const goPath_1 = require("./goPath");
const util_1 = require("./util");
// TODO FOR CodeSuggestion use gocode to support code completion???
function vscodeKindFromGoCodeClass(kind, type) {
    switch (kind) {
        case 'const':
            return vscode.CompletionItemKind.Constant;
        case 'package':
            return vscode.CompletionItemKind.Module;
        case 'type':
            switch (type) {
                case 'struct':
                    return vscode.CompletionItemKind.Class;
                case 'interface':
                    return vscode.CompletionItemKind.Interface;
            }
            return vscode.CompletionItemKind.Struct;
        case 'func':
            return vscode.CompletionItemKind.Function;
        case 'var':
            return vscode.CompletionItemKind.Variable;
        case 'import':
            return vscode.CompletionItemKind.Module;
    }
    return vscode.CompletionItemKind.Property; // TODO@EG additional mappings needed?
}
class ExtendedCompletionItem extends vscode.CompletionItem {
}
const lineCommentFirstWordRegex = /^\s*\/\/\s+[\S]*$/;
const exportedMemberRegex = /(const|func|type|var)/;
const gocodeNoSupportForgbMsgKey = 'dontshowNoSupportForgb';
class GoPlusCompletionItemProvider {
    constructor(globalState) {
        this.pkgsList = new Map();
        this.killMsgShown = false;
        this.setGocodeOptions = true;
        this.isGoMod = false;
        this.excludeDocs = false;
        this.globalState = globalState;
    }
    provideCompletionItems(document, position, token) {
        return this.provideCompletionItemsInternal(document, position, token, util_1.getGoPlusConfig(document.uri)).then((result) => {
            if (!result) {
                return new vscode.CompletionList([], false);
            }
            if (Array.isArray(result)) {
                return new vscode.CompletionList(result, false);
            }
            return result;
        });
    }
    provideCompletionItemsInternal(document, position, token, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Completions for the package statement based on the file name
            // const pkgStatementCompletions = await getPackageStatementCompletions(document);
            // if (pkgStatementCompletions && pkgStatementCompletions.length) {
            // 	return pkgStatementCompletions;
            // }
            this.excludeDocs = false;
            this.gocodeFlags = ['-f=json'];
            if (Array.isArray(config['gocodeFlags'])) {
                this.gocodeFlags.push(...config['gocodeFlags']);
            }
            return this.ensureGoCodeConfigured(document.uri, config).then(() => {
                return new Promise((resolve, reject) => {
                    const filename = document.fileName;
                    const lineText = document.lineAt(position.line).text;
                    const lineTillCurrentPosition = lineText.substr(0, position.character);
                    const autocompleteUnimportedPackages = config['autocompleteUnimportedPackages'] === true && !lineText.match(/^(\s)*(import|package)(\s)+/);
                    // triggering completions in comments on exported members
                    const commentCompletion = getCommentCompletion(document, position);
                    if (commentCompletion) {
                        return resolve([commentCompletion]);
                    }
                    // prevent completion when typing in a line comment that doesnt start from the beginning of the line
                    if (util_1.isPositionInComment(document, position)) {
                        return resolve([]);
                    }
                    const inString = util_1.isPositionInString(document, position);
                    if (!inString && lineTillCurrentPosition.endsWith('"')) {
                        return resolve([]);
                    }
                    const currentWord = getCurrentWord(document, position);
                    if (currentWord.match(/^\d+$/)) {
                        return resolve([]);
                    }
                    let offset = util_1.byteOffsetAt(document, position);
                    let inputText = document.getText();
                    if (!inputText.match(/package\s+(\w+)/)) {
                        let addtText = "package main\r\n\r\n";
                        offset = offset + addtText.length;
                        inputText = addtText + inputText;
                    }
                    const includeUnimportedPkgs = autocompleteUnimportedPackages && !inString && currentWord.length > 0;
                    return this.runGoCode(document, filename, inputText, offset, inString, position, lineText, currentWord, includeUnimportedPkgs, config).then((suggestions) => {
                        // gocode does not suggest keywords, so we have to do it
                        suggestions.push(...getKeywordCompletions(currentWord));
                        // If no suggestions and cursor is at a dot, then check if preceeding word is a package name
                        // If yes, then import the package in the inputText and run gocode again to get suggestions
                        if ((!suggestions || suggestions.length === 0) && lineTillCurrentPosition.endsWith('.')) {
                            const pkgPath = this.getPackagePathFromLine(lineTillCurrentPosition);
                            if (pkgPath.length === 1) {
                                // Now that we have the package path, import it right after the "package" statement
                                const { imports, pkg } = util_1.parseFilePrelude(inputText);
                                let addtText = "package main\r\n\r\n";
                                let lines = inputText.split("\n");
                                let posToAddImport = 0;
                                for (let index = 0; index < lines.length; index++) {
                                    if (index > pkg.start + 1) {
                                        break;
                                    }
                                    posToAddImport = posToAddImport + lines[index].length;
                                }
                                posToAddImport = posToAddImport + 1;
                                const textToAdd = `import "${pkgPath[0]}"\n`;
                                inputText = inputText.substr(0, posToAddImport) + textToAdd + inputText.substr(posToAddImport);
                                offset += textToAdd.length;
                                // Now that we have the package imported in the inputText, run gocode again
                                return this.runGoCode(document, filename, inputText, offset, inString, position, lineText, currentWord, false, config).then((newsuggestions) => {
                                    // Since the new suggestions are due to the package that we imported,
                                    // add additionalTextEdits to do the same in the actual document in the editor
                                    // We use additionalTextEdits instead of command so that 'useCodeSnippetsOnFunctionSuggest'
                                    // feature continues to work
                                    newsuggestions.forEach((item) => {
                                        item.additionalTextEdits = gopImport_1.getTextEditForAddImport(inputText, pkgPath[0]);
                                    });
                                    resolve(newsuggestions);
                                }, reject);
                            }
                            if (pkgPath.length > 1) {
                                pkgPath.forEach((pkg) => {
                                    const item = new vscode.CompletionItem(`${lineTillCurrentPosition.replace('.', '').trim()} (${pkg})`, vscode.CompletionItemKind.Module);
                                    item.additionalTextEdits = gopImport_1.getTextEditForAddImport(vscode.window.activeTextEditor.document.getText(), pkg);
                                    item.insertText = '';
                                    item.detail = pkg;
                                    item.command = {
                                        title: 'Trigger Suggest',
                                        command: 'editor.action.triggerSuggest'
                                    };
                                    suggestions.push(item);
                                });
                                resolve(new vscode.CompletionList(suggestions, true));
                            }
                        }
                        resolve(suggestions);
                    }, reject);
                });
            });
        });
    }
    resolveCompletionItem(item, token) {
        if (!(item instanceof ExtendedCompletionItem) ||
            item.kind === vscode.CompletionItemKind.Module ||
            this.excludeDocs) {
            return;
        }
        if (typeof item.package === 'undefined') {
            gopInstallTools_1.promptForUpdatingTool('gocode');
            return;
        }
        return util_1.runGodoc(path.dirname(item.fileName), item.package || path.dirname(item.fileName), item.receiver, item.label, token)
            .then((doc) => {
            item.documentation = new vscode.MarkdownString(doc);
            return item;
        })
            .catch((err) => {
            console.log(err);
            return item;
        });
    }
    ensureGoCodeConfigured(fileuri, goConfig) {
        const currentFile = fileuri.fsPath;
        const setPkgsList = gopPackages_1.getImportablePackages(currentFile, true).then((pkgMap) => {
            this.pkgsList = pkgMap;
        });
        return Promise.all([setPkgsList]).then(() => {
            return;
        });
    }
    dispose() {
    }
    // Given a line ending with dot, return the import paths of packages that match with the word preceeding the dot
    getPackagePathFromLine(line) {
        const pattern = /(\w+)\.$/g;
        const wordmatches = pattern.exec(line);
        if (!wordmatches) {
            return [];
        }
        const [_, pkgNameFromWord] = wordmatches;
        // Word is isolated. Now check pkgsList for a match
        return this.getPackageImportPath(pkgNameFromWord);
    }
    runGoCode(document, filename, inputText, offset, inString, position, lineText, currentWord, includeUnimportedPkgs, config) {
        return new Promise((resolve, reject) => {
            const gocodeName = this.isGoMod ? 'gocode-gomod' : 'gocode';
            const gocode = util_1.getBinPath(gocodeName);
            if (!path.isAbsolute(gocode)) {
                gopInstallTools_1.promptForMissingTool(gocodeName);
                return reject();
            }
            const env = goEnv_1.toolExecutionEnvironment();
            let stdout = '';
            let stderr = '';
            // stamblerre/gocode does not support -unimported-packages flags.
            if (this.isGoMod) {
                const unimportedPkgIndex = this.gocodeFlags.indexOf('-unimported-packages');
                if (unimportedPkgIndex >= 0) {
                    this.gocodeFlags.splice(unimportedPkgIndex, 1);
                }
            }
            // -exclude-docs is something we use internally and is not related to gocode
            const excludeDocsIndex = this.gocodeFlags.indexOf('-exclude-docs');
            if (excludeDocsIndex >= 0) {
                this.gocodeFlags.splice(excludeDocsIndex, 1);
                this.excludeDocs = true;
            }
            // Spawn `gocode` process
            const p = cp.spawn(gocode, [...this.gocodeFlags, 'autocomplete', "test.go", '' + offset], { env });
            p.stdout.on('data', (data) => {
                (stdout += data);
            });
            p.stderr.on('data', (data) => {
                (stderr += data);
            });
            p.on('error', (err) => {
                if (err && err.code === 'ENOENT') {
                    gopInstallTools_1.promptForMissingTool(gocodeName);
                    return reject();
                }
                return reject(err);
            });
            p.on('close', (code) => {
                try {
                    if (code !== 0) {
                        if (stderr.indexOf(`rpc: can't find service Server.AutoComplete`) > -1 && !this.killMsgShown) {
                            vscode.window.showErrorMessage('Auto-completion feature failed as an older gocode process is still running. Please kill the running process for gocode and try again.');
                            this.killMsgShown = true;
                        }
                        if (stderr.startsWith('flag provided but not defined:')) {
                            gopInstallTools_1.promptForUpdatingTool(gocodeName);
                        }
                        return reject();
                    }
                    const results = JSON.parse(stdout.toString());
                    let suggestions = [];
                    const packageSuggestions = [];
                    const wordAtPosition = document.getWordRangeAtPosition(position);
                    let areCompletionsForPackageSymbols = false;
                    if (results && results[1]) {
                        for (const suggest of results[1]) {
                            if (inString && suggest.class !== 'import') {
                                continue;
                            }
                            const item = new ExtendedCompletionItem(suggest.name);
                            item.kind = vscodeKindFromGoCodeClass(suggest.class, suggest.type);
                            item.package = suggest.package;
                            item.receiver = suggest.receiver;
                            item.fileName = document.fileName;
                            item.detail = suggest.type;
                            if (!areCompletionsForPackageSymbols && item.package && item.package !== 'builtin') {
                                areCompletionsForPackageSymbols = true;
                            }
                            if (suggest.class === 'package') {
                                const possiblePackageImportPaths = this.getPackageImportPath(item.label);
                                if (possiblePackageImportPaths.length === 1) {
                                    item.detail = possiblePackageImportPaths[0];
                                }
                                packageSuggestions.push(suggest.name);
                            }
                            if (inString && suggest.class === 'import') {
                                item.textEdit = new vscode.TextEdit(new vscode.Range(position.line, lineText.substring(0, position.character).lastIndexOf('"') + 1, position.line, position.character), suggest.name);
                            }
                            if ((config['useCodeSnippetsOnFunctionSuggest'] ||
                                config['useCodeSnippetsOnFunctionSuggestWithoutType']) &&
                                ((suggest.class === 'func' && lineText.substr(position.character, 2) !== '()') || // Avoids met() -> method()()
                                    (suggest.class === 'var' &&
                                        suggest.type.startsWith('func(') &&
                                        lineText.substr(position.character, 1) !== ')' && // Avoids snippets when typing params in a func call
                                        lineText.substr(position.character, 1) !== ',')) // Avoids snippets when typing params in a func call
                            ) {
                                const { params, returnType } = util_1.getParametersAndReturnType(suggest.type.substring(4));
                                const paramSnippets = [];
                                for (let i = 0; i < params.length; i++) {
                                    let param = params[i].trim();
                                    if (param) {
                                        param = param.replace('${', '\\${').replace('}', '\\}');
                                        if (config['useCodeSnippetsOnFunctionSuggestWithoutType']) {
                                            if (param.includes(' ')) {
                                                // Separate the variable name from the type
                                                param = param.substr(0, param.indexOf(' '));
                                            }
                                        }
                                        paramSnippets.push('${' + (i + 1) + ':' + param + '}');
                                    }
                                }
                                item.insertText = new vscode.SnippetString(suggest.name + '(' + paramSnippets.join(', ') + ')');
                            }
                            if (config['useCodeSnippetsOnFunctionSuggest'] &&
                                suggest.class === 'type' &&
                                suggest.type.startsWith('func(')) {
                                const { params, returnType } = util_1.getParametersAndReturnType(suggest.type.substring(4));
                                const paramSnippets = [];
                                for (let i = 0; i < params.length; i++) {
                                    let param = params[i].trim();
                                    if (param) {
                                        param = param.replace('${', '\\${').replace('}', '\\}');
                                        if (!param.includes(' ')) {
                                            // If we don't have an argument name, we need to create one
                                            param = 'arg' + (i + 1) + ' ' + param;
                                        }
                                        const arg = param.substr(0, param.indexOf(' '));
                                        paramSnippets.push('${' +
                                            (i + 1) +
                                            ':' +
                                            arg +
                                            '}' +
                                            param.substr(param.indexOf(' '), param.length));
                                    }
                                }
                                item.insertText = new vscode.SnippetString(suggest.name +
                                    '(func(' +
                                    paramSnippets.join(', ') +
                                    ') {\n	$' +
                                    (params.length + 1) +
                                    '\n})' +
                                    returnType);
                            }
                            if (wordAtPosition &&
                                wordAtPosition.start.character === 0 &&
                                suggest.class === 'type' &&
                                !util_1.goBuiltinTypes.has(suggest.name)) {
                                const auxItem = new vscode.CompletionItem(suggest.name + ' method', vscode.CompletionItemKind.Snippet);
                                auxItem.label = 'func (*' + suggest.name + ')';
                                auxItem.filterText = suggest.name;
                                auxItem.detail = 'Method snippet';
                                auxItem.sortText = 'b';
                                const prefix = 'func (' + suggest.name[0].toLowerCase() + ' *' + suggest.name + ')';
                                const snippet = prefix + ' ${1:methodName}(${2}) ${3} {\n\t$0\n}';
                                auxItem.insertText = new vscode.SnippetString(snippet);
                                suggestions.push(auxItem);
                            }
                            // Add same sortText to all suggestions from gocode so that they appear before the unimported packages
                            item.sortText = 'a';
                            suggestions.push(item);
                        }
                    }
                    // Add importable packages matching currentword to suggestions
                    if (includeUnimportedPkgs && !this.isGoMod && !areCompletionsForPackageSymbols) {
                        suggestions = suggestions.concat(getPackageCompletions(document, currentWord, this.pkgsList, packageSuggestions));
                    }
                    resolve(suggestions);
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
    /**
     * Returns import path for given package. Since there can be multiple matches,
     * this returns an array of matches
     * @param input Package name
     */
    getPackageImportPath(input) {
        const matchingPackages = [];
        this.pkgsList.forEach((info, pkgPath) => {
            if (input === info.name) {
                matchingPackages.push(pkgPath);
            }
        });
        return matchingPackages;
    }
}
exports.GoPlusCompletionItemProvider = GoPlusCompletionItemProvider;
/**
 * Provides completion item for the exported member in the next line if current line is a comment
 * @param document The current document
 * @param position The cursor position
 */
function getCommentCompletion(document, position) {
    const lineText = document.lineAt(position.line).text;
    const lineTillCurrentPosition = lineText.substr(0, position.character);
    // triggering completions in comments on exported members
    if (lineCommentFirstWordRegex.test(lineTillCurrentPosition) && position.line + 1 < document.lineCount) {
        const nextLine = document.lineAt(position.line + 1).text.trim();
        const memberType = nextLine.match(exportedMemberRegex);
        let suggestionItem;
        if (memberType && memberType.length === 4) {
            suggestionItem = new vscode.CompletionItem(memberType[3], vscodeKindFromGoCodeClass(memberType[1], ''));
        }
        return suggestionItem;
    }
}
function getCurrentWord(document, position) {
    // get current word
    const wordAtPosition = document.getWordRangeAtPosition(position);
    let currentWord = '';
    if (wordAtPosition && wordAtPosition.start.character < position.character) {
        const word = document.getText(wordAtPosition);
        currentWord = word.substr(0, position.character - wordAtPosition.start.character);
    }
    return currentWord;
}
/**
 * Return importable packages that match given word as Completion Items
 * @param document Current document
 * @param currentWord The word at the cursor
 * @param allPkgMap Map of all available packages and their import paths
 * @param importedPackages List of imported packages. Used to prune imported packages out of available packages
 */
function getPackageCompletions(document, currentWord, allPkgMap, importedPackages = []) {
    const cwd = path.dirname(document.fileName);
    const goWorkSpace = goPath_1.getCurrentGoWorkspaceFromGOPATH(util_1.getCurrentGoPath(), cwd);
    const workSpaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const currentPkgRootPath = (workSpaceFolder ? workSpaceFolder.uri.path : cwd).slice(goWorkSpace.length + 1);
    const completionItems = [];
    allPkgMap.forEach((info, pkgPath) => {
        const pkgName = info.name;
        if (pkgName.startsWith(currentWord) && importedPackages.indexOf(pkgName) === -1) {
            const item = new vscode.CompletionItem(pkgName, vscode.CompletionItemKind.Keyword);
            item.detail = pkgPath;
            item.documentation = 'Imports the package';
            item.insertText = pkgName;
            item.command = {
                title: 'Import Package',
                command: 'goplus.import.add',
                arguments: [{ importPath: pkgPath, from: 'completion' }]
            };
            item.kind = vscode.CompletionItemKind.Module;
            // Unimported packages should appear after the suggestions from gocode
            const isStandardPackage = !item.detail.includes('.');
            item.sortText = isStandardPackage ? 'za' : pkgPath.startsWith(currentPkgRootPath) ? 'zb' : 'zc';
            completionItems.push(item);
        }
    });
    return completionItems;
}
function getKeywordCompletions(currentWord) {
    if (!currentWord.length) {
        return [];
    }
    const completionItems = [];
    util_1.goKeywords.forEach((keyword) => {
        if (keyword.startsWith(currentWord)) {
            completionItems.push(new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword));
        }
    });
    return completionItems;
}
function getPackageStatement(inputText, offset) {
    // 'Smart Snippet' for package clause
    if (inputText.match(/package\s+(\w+)/)) {
        return inputText;
    }
    let addtText = "package main\r\n\r\n";
    addtText.length;
    inputText = addtText + inputText;
    return inputText;
}
//# sourceMappingURL=gopSuggest.js.map