/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoHoverProvider = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const goDeclaration_1 = require("./goDeclaration");
const util_1 = require("./util");
class GoHoverProvider {
    constructor(goPlusConfig) {
        this.goPlusConfig = goPlusConfig;
    }
    provideHover(document, position, token) {
        if (!this.goPlusConfig) {
            this.goPlusConfig = util_1.getGoPlusConfig(document.uri);
        }
        let goPlusConfig = this.goPlusConfig;
        // Temporary fix to fall back to godoc if guru is the set docsTool
        if (goPlusConfig['docsTool'] === 'guru') {
            goPlusConfig = Object.assign({}, goPlusConfig, { docsTool: 'godoc' });
        }
        return goDeclaration_1.definitionLocation(document, position, goPlusConfig, true, token).then((definitionInfo) => {
            if (definitionInfo == null) {
                return null;
            }
            const lines = definitionInfo.declarationlines
                .filter((line) => line !== '')
                .map((line) => line.replace(/\t/g, '    '));
            let text;
            text = lines.join('\n').replace(/\n+$/, '');
            const hoverTexts = new vscode.MarkdownString();
            hoverTexts.appendCodeblock(text, 'go');
            if (definitionInfo.doc != null) {
                hoverTexts.appendMarkdown(definitionInfo.doc);
            }
            const hover = new vscode_1.Hover(hoverTexts);
            return hover;
        }, () => {
            return null;
        });
    }
}
exports.GoHoverProvider = GoHoverProvider;
//# sourceMappingURL=gopExtraInfo.js.map