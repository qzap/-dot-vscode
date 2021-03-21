'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let align = new BlockAlign();
    let disposable = vscode.commands.registerCommand('extension.blockalign', () => {
        align.align();
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(align);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
class BlockAlign {
    align() {
        this._editor = vscode.window.activeTextEditor;
        this._tabSize = this._editor.options.tabSize;
        if (this._editor.selection.isEmpty) {
            // the Position object gives you the line and character where the cursor is
            this._cursorPos = this._editor.selection.active;
        }
        this.determineSeparator();
        if (this._alignChar !== undefined) {
            this.determineRange();
            const editor = new vscode.WorkspaceEdit();
            var lines = {};
            var positions = {};
            const reg = new RegExp(/^([ \t]*).*/);
            this._minPos = 0;
            for (var current = this._blockStart; current <= this._blockEnd; current++) {
                lines[current] = this.trimLine(this._editor.document.lineAt(current).text);
            }
            const prefix = reg.exec(lines[this._blockStart]);
            if (typeof prefix == "object" && prefix[1]) {
                for (var current = this._blockStart; current <= this._blockEnd; current++) {
                    lines[current] = prefix[1] + lines[current].trim();
                }
            }
            for (var current = this._blockStart; current <= this._blockEnd; current++) {
                positions[current] = this.indexOf(this._alignChar, lines[current]);
                if (positions[current] > this._minPos) {
                    this._minPos = positions[current];
                }
            }
            for (var current = this._blockStart; current <= this._blockEnd; current++) {
                const line = lines[current];
                editor.replace(this._editor.document.uri, this._editor.document.lineAt(current).range, this.alignLine(line));
            }
            vscode.workspace.applyEdit(editor);
        }
    }
    indexOf(needle, haystack, realpos = false) {
        let rv = -1;
        let rvrp = -1;
        let inQuotes = false;
        const l = haystack.length;
        const size = needle.length;
        let pos = 0;
        for (let i = 0; i < l; i++) {
            const c = haystack.substr(i, 1);
            // Kijk of het huidige separator-ding in quotes staat, dan skippen we het.
            if (c === "'" || c === '"') {
                if (i === 0 || haystack.substr(i - 1, 1) !== "\\") {
                    inQuotes = !inQuotes;
                }
            }
            if (!inQuotes && haystack.substr(i, size) === needle) {
                rv = pos;
                rvrp = i;
                break;
            }
            pos += (c === "\t") ? this._tabSize : 1;
        }
        return realpos ? rvrp : rv;
    }
    substr(line, start, length = -1) {
        let rv = null;
        const l = line.length;
        let pos = 0;
        let toCopy = length;
        for (let i = 0; (i < l) && ((toCopy > 0) || (length === -1)); i++) {
            const c = line.substr(i, 1);
            const d = (c === "\t") ? this._tabSize : 1;
            // console.log( "substr ", i, c, ( c === "\t" ) ? this._tabSize : 1, pos, start, ( pos >= start && ( ( toCopy > 0 ) || ( length === -1 ) ) ) ? "Copied" : "--" );
            if (pos >= start && ((toCopy > 0) || (length === -1))) {
                if (rv === null)
                    rv = "";
                rv += c;
                toCopy -= d;
            }
            pos += d;
        }
        return rv;
    }
    alignLine(line) {
        var rv = line;
        var pos = this.indexOf(this._alignChar, line);
        var rpt = " ";
        if (this._minPos - pos > 0) {
            rpt += " ".repeat(this._minPos - pos);
        }
        rv = this.substr(line, 0, pos) + rpt + this._alignChar + " " + this.substr(line, pos + this._alignChar.length).trim();
        return rv;
    }
    trimLine(line) {
        var rv = line;
        var pos = this.indexOf(this._alignChar, line);
        var rpt = "";
        if (this._minPos - pos > 0) {
            rpt = " ".repeat(this._minPos - pos);
        }
        rv = this.substr(line, 0, pos).replace(/[\t ]+$/, '') + this._alignChar + this.substr(line, pos + this._alignChar.length).trim();
        return rv;
    }
    determineSeparator() {
        const separators = ["===", "!==", "!=", "<>", "-=", "+=", "~=", "==", "=>", "*=", "/=", "?=", "|=", "%=", ".=", ":", "=", ">", "<"];
        let tempAlignChar = null;
        let differentPositions = true;
        let lastPosition;
        for (let entry of separators) {
            let blockStart = this._cursorPos._line;
            let blockSize = 0;
            let maxBlockSize = 0;
            console.log(entry);
            if (entry === undefined)
                continue;
            // Kunnen deze wel overslaan.. 
            if (this.indexOf(entry, this._editor.document.lineAt(this._cursorPos._line).text) == -1) {
                continue;
            }
            while (blockStart > 1) {
                let line = this._editor.document.lineAt(blockStart - 1);
                if (line.isEmptyOrWhitespace == false && this.indexOf(entry, line.text) > 0) {
                    blockStart--;
                }
                else {
                    break;
                }
            }
            console.log("Blockstart", blockStart);
            let blockEnd = this._cursorPos._line;
            while (blockEnd < this._editor.document.lineCount - 1) {
                let line = this._editor.document.lineAt(blockEnd + 1);
                if (line.isEmptyOrWhitespace == false && this.indexOf(entry, line.text) > 0) {
                    blockEnd++;
                }
                else {
                    break;
                }
            }
            lastPosition = -1;
            differentPositions = false;
            for (let i = blockStart; i <= blockEnd; i++) {
                let line = this._editor.document.lineAt(i);
                if (lastPosition == -1) {
                    lastPosition = this.indexOf(entry, line.text);
                }
                else {
                    let currentPosition = this.indexOf(entry, line.text);
                    differentPositions = (currentPosition != lastPosition);
                    if (differentPositions)
                        break;
                }
            }
            if (blockEnd - blockStart > 0 && differentPositions) {
                maxBlockSize = blockEnd - blockStart;
                tempAlignChar = entry;
                break;
            }
        }
        if (tempAlignChar !== null) {
            this._alignChar = tempAlignChar;
        }
        else {
            this._alignChar = undefined;
            console.log("No separator found!");
        }
    }
    determineRange() {
        this._blockStart = this._cursorPos._line;
        while (this._blockStart > 1) {
            let line = this._editor.document.lineAt(this._blockStart - 1);
            if (line.isEmptyOrWhitespace == false && this.indexOf(this._alignChar, line.text) > 0) {
                this._blockStart--;
            }
            else {
                break;
            }
        }
        this._blockEnd = this._cursorPos._line;
        while (this._blockEnd < this._editor.document.lineCount - 1) {
            let line = this._editor.document.lineAt(this._blockEnd + 1);
            if (line.isEmptyOrWhitespace == false && this.indexOf(this._alignChar, line.text) > 0) {
                this._blockEnd++;
            }
            else {
                break;
            }
        }
    }
    dispose() {
    }
}
//# sourceMappingURL=extension.js.map