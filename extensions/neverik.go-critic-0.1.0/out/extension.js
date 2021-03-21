'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const cp = require("child_process");
function activate(context) {
    let critic = new GoCritic();
    critic.activate(context.subscriptions);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
class GoCritic {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection();
    }
    activate(subscriptions) {
        vscode.workspace.onDidOpenTextDocument(this.doLint, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument((textDocument) => {
            this.diagnosticCollection.delete(textDocument.uri);
        }, null, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.doLint, this);
        vscode.workspace.textDocuments.forEach(this.doLint, this);
    }
    dispose() {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
    }
    doLint(textDocument) {
        if (textDocument.languageId !== 'go') {
            return;
        }
        this.getGoCriticOutput(textDocument.fileName).then((warnings) => {
            let diagnostics = [];
            warnings.forEach((item) => {
                let lineSnippet = textDocument.lineAt(item.line).text;
                let startCol = lineSnippet.length - lineSnippet.trimLeft().length;
                let endCol = lineSnippet.length;
                let [startPosition, endPosition] = [
                    new vscode.Position(item.line, startCol),
                    new vscode.Position(item.line, endCol)
                ];
                let range = new vscode.Range(startPosition, endPosition);
                let message = `${item.rule}: ${item.warning}`;
                let diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            });
            this.diagnosticCollection.set(textDocument.uri, diagnostics);
        }).catch(err => {
            console.error(err);
        });
    }
    getGoCriticOutput(filename) {
        let args = ['check', filename];
        return new Promise((resolve, reject) => {
            cp.exec("gocritic " + args.join(" "), (err, _, stdErr) => {
                let decoded = stdErr;
                if (err !== null) {
                    if (err.message.startsWith("Command failed")) {
                        decoded = err.message.split("\n").slice(1).join("\n");
                    }
                    else {
                        reject(err);
                    }
                }
                const warnings = decoded.split("\n").filter(x => x !== "").map(x => {
                    let colonSections = x.split(":");
                    let [line, col] = colonSections.slice(1, 3).map(i => Number.parseInt(i) - 1);
                    let rule = colonSections[3];
                    let warning = colonSections.slice(4).join(":");
                    return {
                        line,
                        col,
                        rule,
                        warning
                    };
                });
                resolve(warnings);
            });
        });
    }
}
//# sourceMappingURL=extension.js.map