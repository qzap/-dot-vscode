"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_file_1 = require("../parser/vue-file");
exports.resolver = (vueFiles, setting, editor, assetResolver) => ({
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                vueFiles: vueFiles.map(file => vue_file_1.vueFileToPayload(file, assetResolver)),
                sharedStyle: yield setting.readSharedStyle(),
                activeUri: editor.activeDocumentUrl
            };
        });
    }
});
