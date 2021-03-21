"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manipulate_1 = require("../parser/template/manipulate");
const manipulate_2 = require("../parser/style/manipulate");
class EditorRepository {
    constructor(activeDocumentUrl, vueFiles, operations) {
        this.activeDocumentUrl = activeDocumentUrl;
        this.vueFiles = vueFiles;
        this.operations = operations;
    }
    selectNode(uri, templatePath, stylePaths) {
        if (this.currentHighlight) {
            this.currentHighlight.dispose();
            this.currentHighlight = undefined;
        }
        const vueFile = this.vueFiles.get(uri);
        if (!vueFile || !vueFile.template || templatePath.length === 0) {
            return;
        }
        const element = manipulate_1.getNode(vueFile.template, templatePath);
        if (!element) {
            return;
        }
        function notUndef(n) {
            return n !== undefined;
        }
        const styleRules = stylePaths
            .map(path => manipulate_2.getNode(vueFile.styles, path))
            .filter(notUndef);
        const highlightRanges = [element, ...styleRules].map(node => {
            return node.range;
        });
        this.currentHighlight = this.operations.highlight(uri, highlightRanges);
    }
}
exports.EditorRepository = EditorRepository;
