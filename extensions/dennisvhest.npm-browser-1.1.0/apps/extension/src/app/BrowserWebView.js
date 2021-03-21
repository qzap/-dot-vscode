import * as path from 'path';
import * as vscode from 'vscode';
var BrowserWebView = /** @class */ (function () {
    function BrowserWebView(context, production) {
        var _this = this;
        if (production === void 0) { production = false; }
        this.commandListeners = {
            'npm-install': function () { return _this.onTerminalCommand; },
            'npm-uninstall': function () { return _this.onTerminalCommand; },
            'fetch-package': function () { return _this.onTerminalCommand; },
            'package-json-selected': function () { return _this.onValueCommand; },
            'vscode-toast-command': function () { return _this.onVSCodeToastCommand; }
        };
        this.baseScripts = [
            'runtime.js',
            'polyfills.js',
            'scripts.js',
            'main.js',
        ];
        this.devScripts = [
            'styles.js',
            'vendor.js'
        ];
        this._context = context;
        // Create and show a new webview
        this._panel = vscode.window.createWebviewPanel('npmBrowser', 'NPM Browser', vscode.ViewColumn.Active, {
            enableScripts: true,
            localResourceRoots: [this.getAssetUri()]
        });
        this.isOpen = true;
        this._panel.onDidDispose(function () { return _this.isOpen = false; });
        this._panel.webview.html = this.getWebviewContent(production);
        this._panel.webview.onDidReceiveMessage(function (command) {
            // Process command from webview
            var commandListener = _this.commandListeners[command.type];
            if (commandListener)
                commandListener()(command);
        }, undefined, context.subscriptions);
    }
    /**
     * Sends command to the web view.
     * @param command The command to send.
     */
    BrowserWebView.prototype.sendCommand = function (command) {
        this._panel.webview.postMessage(command);
    };
    BrowserWebView.prototype.setActivePanel = function () {
        if (this._panel)
            this._panel.reveal(vscode.ViewColumn.Active);
    };
    BrowserWebView.prototype.getAssetUri = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return vscode.Uri.file(path.join.apply(path, [this._context.extensionPath, 'apps', 'extension', 'src', 'browser'].concat(paths)));
    };
    BrowserWebView.prototype.getAssetResourceUri = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return this._panel.webview.asWebviewUri(this.getAssetUri.apply(this, paths));
    };
    /**
     * Gets the web view HTML containing the required Angular scripts.
     * @param production A boolean indicating if the Angular app should
     * be run in the production configuration.
     */
    BrowserWebView.prototype.getWebviewContent = function (production) {
        var _this = this;
        var nonce = this.getNonce();
        var contentSecurityPolicies = this.getContentSecurityPolicies(nonce);
        var scripts = this.baseScripts;
        if (!production)
            scripts = scripts.concat(this.devScripts);
        scripts = scripts.map(function (script) { return "<script nonce=\"" + nonce + "\" src=\"" + _this.getAssetResourceUri(script) + "\" defer></script>"; });
        return "<!doctype html>\n                <html lang=\"en\">\n                <head>\n                    <meta charset=\"utf-8\">\n                    <title>NpmBrowser</title>\n                    <meta http-equiv=\"Content-Security-Policy\" content=\"" + contentSecurityPolicies.join(';') + "\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n                    <link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\">\n                    " + (production ? "<link rel=\"stylesheet\" href=\"" + this.getAssetResourceUri('styles.css') + "\">" : '') + "\n                </head>\n                <body>\n                    <npmb-root></npmb-root>\n                    <script nonce=\"" + nonce + "\">\n                        const vscode = acquireVsCodeApi();\n                        const workspaceState = " + JSON.stringify(this._context.workspaceState['_value']) + ";\n                        const assetPath = \"" + this._panel.webview.asWebviewUri(vscode.Uri.file(this._context.extensionPath)) + "/apps/extension/src/browser/assets/\";\n                    </script>\n                    " + scripts.join('') + "\n                </body>\n                </html>";
    };
    BrowserWebView.prototype.getContentSecurityPolicies = function (nonce) {
        return [
            "default-src " + this._panel.webview.cspSource,
            "script-src 'nonce-" + nonce + "'",
            "style-src " + this._panel.webview.cspSource + " 'unsafe-inline'",
            'font-src https:',
            "img-src " + this._panel.webview.cspSource + " https: http:",
            'connect-src https:'
        ];
    };
    BrowserWebView.prototype.getNonce = function () {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    return BrowserWebView;
}());
export { BrowserWebView };
//# sourceMappingURL=BrowserWebView.js.map