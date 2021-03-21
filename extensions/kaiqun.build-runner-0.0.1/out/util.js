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
exports.readYaml = void 0;
const vscode = require("vscode");
const yaml = require("yaml");
/**
 * 读取YAML文件，并转换为object
 * @param uri
 */
function readYaml(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield vscode.workspace.fs.readFile(uri);
            return yaml.parse(content === null || content === void 0 ? void 0 : content.toString());
        }
        catch (error) { }
    });
}
exports.readYaml = readYaml;
//# sourceMappingURL=util.js.map