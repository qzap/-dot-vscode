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
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', pattern: '**/*.pug' }, new DartDefinitionProvider()));
    console.log('extension "flutter-view-vscode" started');
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
class DartDefinitionProvider {
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // find the text we highlighted
            const range = document.getWordRangeAtPosition(position);
            const selected = document.getText(range);
            console.log('finding definition for', selected, 'at line', position.line + 1);
            // find the matching dart file and text/code
            const relativeFile = document.uri.path.replace('.pug', '.dart');
            const dartDocument = yield vscode.workspace.openTextDocument(vscode.Uri.file(relativeFile));
            const dartCode = dartDocument.getText();
            // create a map of pug->dart code relationships
            const locations = this.getPugLocations(dartCode);
            console.log(JSON.stringify(locations, null, 3));
            const pugLine = position.line + 1;
            let location = locations.find(loc => loc.pug == pugLine);
            if (location) {
                const dartTextLine = dartDocument.lineAt(location.dart);
                const dartPosition = new vscode.Position(location.dart - 1, dartTextLine.firstNonWhitespaceCharacterIndex);
                return new vscode.Location(vscode.Uri.file(relativeFile), dartPosition);
            }
            else {
                return null;
            }
        });
    }
    getPugLocations(text) {
        const locations = [];
        const matches = text.match(/\#([0-9]+),([0-9]+)/gi);
        if (matches) {
            for (let match of matches) {
                const location = /\#([0-9]+),([0-9]+)/gi.exec(match);
                if (location) {
                    locations.push({
                        pug: parseInt(location[1]),
                        dart: lineOf(text, match)
                    });
                }
            }
        }
        return locations;
    }
}
function lineOf(text, substring) {
    let line = 0, matchedChars = 0;
    for (let i = 0; i < text.length; i++) {
        text[i] === substring[matchedChars] ? matchedChars++ : matchedChars = 0;
        if (matchedChars === substring.length)
            return line + 1;
        if (text[i] === '\n')
            line++;
    }
    return -1;
}
//# sourceMappingURL=extension.js.map