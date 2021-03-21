'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
class BrowserSyncContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
        this.counter = 1;
    }
    /**
     * Provide event that represent onDidChange for subscribe,
     * registerTextDocumentContentProvider will subscribe a listener that calls provideTextDocumentContent
     *
     * Reference: https://github.com/Microsoft/vscode/blob/71d332b4645da2c7cf91ea54eaebc4f792ac556d/src/vs/workbench/api/node/extHostDocumentContentProviders.ts
     */
    get onDidChange() {
        return this._onDidChange.event;
    }
    /**
     * Emitt (fire) onDidChange event
     *
     * @param uri
     */
    update(uri) {
        if (!this._waiting) {
            this._waiting = true;
            // Workaround to this problem
            // https://github.com/Microsoft/vscode-mssql/issues/669
            // In VSCode 1.9.0, it does a string comparison and only refreshes the page if the content is different
            this.counter++;
            setTimeout(() => {
                this._waiting = false;
                this._onDidChange.fire(uri);
            }, 300);
        }
    }
    provideTextDocumentContent(uri, token) {
        console.log('provideTextDocumentContent');
        let src = null;
        if (uri.fragment === "server") {
            let fileName = path.basename(uri.fsPath);
            src = `http://localhost:${uri.query}/${fileName}`;
        }
        else {
            src = `http://localhost:${uri.query}`;
        }
        return `
            <html>
                <head>
                    <style>
                         body, html, div {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                            height: 100%;
                            background-color: #fff;
                        }
                    </style>
                </head>
                <body>
                    <div style="display:none; ">${this.counter}</div>
                    <div>
                        <iframe src="${src}" width="100%" height="100%" seamless frameborder=0></iframe>
                    </div>
                </body>
            </html>
        `;
    }
}
exports.default = BrowserSyncContentProvider;
//# sourceMappingURL=BrowserSyncContentProvider.js.map