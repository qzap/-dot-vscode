"use strict";
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
const yaml = require("js-yaml");
const get_pubspec_path_1 = require("./get-pubspec-path");
const vscode_1 = require("vscode");
function getPubspec() {
    return __awaiter(this, void 0, void 0, function* () {
        const pubspecPath = get_pubspec_path_1.getPubspecPath();
        if (pubspecPath) {
            try {
                let content = yield vscode_1.workspace.fs.readFile(vscode_1.Uri.file(pubspecPath));
                return yaml.safeLoad(content.toString());
            }
            catch (_) { }
        }
    });
}
exports.getPubspec = getPubspec;
//# sourceMappingURL=get-pubspec.js.map