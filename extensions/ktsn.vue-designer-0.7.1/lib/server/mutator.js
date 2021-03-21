"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutator = (vueFiles, editor) => ({
    selectNode({ uri, templatePath, stylePaths }) {
        editor.selectNode(uri, templatePath, stylePaths);
    },
    addNode({ uri, insertNodeUri, path }) {
        vueFiles.addTemplateNode(uri, insertNodeUri, path);
    },
    addDeclaration({ uri, declaration, path }) {
        vueFiles.addStyleDeclaration(uri, declaration, path);
    },
    removeDeclaration({ uri, path }) {
        vueFiles.removeStyleDeclaration(uri, path);
    },
    updateDeclaration({ uri, declaration }) {
        vueFiles.updateStyleDeclaration(uri, declaration);
    }
});
