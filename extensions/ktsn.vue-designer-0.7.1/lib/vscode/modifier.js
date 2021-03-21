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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const modifier_1 = require("../parser/modifier");
function applyModifiers(uri, modifiers) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedUri = vscode.Uri.parse(uri);
        const doc = yield vscode.workspace.openTextDocument(parsedUri);
        const wsEdit = modifier_1.reduce(modifiers, (edit, m) => {
            switch (m.type) {
                case 'Add':
                    edit.insert(parsedUri, doc.positionAt(m.pos), m.value);
                    break;
                case 'Remove':
                    edit.delete(parsedUri, new vscode.Range(doc.positionAt(m.pos), doc.positionAt(m.pos + m.length)));
                    break;
                default:
            }
            return edit;
        }, new vscode.WorkspaceEdit());
        yield vscode.workspace.applyEdit(wsEdit);
    });
}
exports.applyModifiers = applyModifiers;
