"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const engines = require("./engines");
const messenger_1 = require("./messenger");
const scheduler_1 = require("./scheduler");
const utilities = require("./utilities");
const previewType = "graphviz.preview";
const ALL_MODS = "all_mods";
class PreviewPort {
    constructor(view) {
        this.view = view;
    }
    send(message) {
        this.view.postMessage(message);
    }
    onReceive(handler) {
        this.view.onDidReceiveMessage(handler);
    }
}
function uriToVscodeResource(uri) {
    return uri.with({ scheme: "vscode-resource" }).toString(true);
}
class PreviewManager {
    constructor(context, template) {
        this.previewContexts = new WeakMap();
        this.mod = ALL_MODS;
        this.graphText = "";
        this.Graph = require("@dagrejs/graphlib").Graph;
        this.g = new this.Graph({ multigraph: true });
        this.previewDirUri = vscode.Uri.file(context.asAbsolutePath("out/preview"));
        this.previewContent = template.replace(/\{preview-dir\}/g, uriToVscodeResource(this.previewDirUri));
    }
    async showGrapherToSide(editor) {
        const document = editor.document;
        const context = this.previewContexts.get(document);
        if (context === undefined) {
            this.previewContexts.set(document, await this.createPreview(document, vscode.ViewColumn.Beside));
        }
        else {
            context.webviewPanel.reveal(undefined, true);
        }
    }
    async updatePreview(document) {
        const context = this.previewContexts.get(document);
        if (context !== undefined) {
            context.updatePreview();
        }
    }
    async updateModPreview(document, mod) {
        const context = this.previewContexts.get(document);
        this.mod = mod;
        await this.updateGraphText();
        if (context !== undefined) {
            context.updatePreview();
        }
    }
    async exportImage(source, svgContent, workingDir) {
        const filePath = await vscode.window.showSaveDialog({
            filters: { "PDF": ["pdf"], "PNG Image": ["png"], "SVG Image": ["svg"] }
        });
        if (filePath) {
            await engines.currentEngine.saveToFile(source, svgContent, filePath.fsPath, workingDir);
        }
    }
    async updateGraphText() {
        let graphText = "digraph G{\n";
        if (this.mod === ALL_MODS) {
            const mods = this.g.nodes();
            if (mods.length > 200) {
                vscode.window.showInformationMessage("The size of dependency mods is more than 200, so please check ONE of them.");
            }
            else {
                const edges = this.g.edges();
                for (const edge of edges) {
                    graphText += `"${edge.v}" -> "${edge.w}" ${edge.name}\n`;
                }
            }
        }
        else {
            ;
            let froms = [];
            let used = new Set();
            froms.push(this.mod);
            used.add(this.mod);
            while (froms.length > 0) {
                const to = froms.pop();
                // const edgeS = this.g.outEdges(to);
                const ine = this.g.inEdges(to);
                // const all = this.g.nodeEdges(to);
                for (const edge of ine) {
                    graphText += `"${edge.v}" -> "${edge.w}" ${edge.name}\n`;
                    if (!used.has(edge.v)) {
                        froms.push(edge.v);
                        used.add(edge.v);
                    }
                }
            }
            used = new Set([]);
        }
        graphText += "}";
        this.graphText = graphText;
    }
    async goModGraph(dir) {
        try {
            const [exitCode, stdout, stderr] = await utilities.runChildProcess("go", ["mod", "graph"], dir, "", undefined);
            if (exitCode !== 0) {
                throw new Error(stderr.trim());
            }
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);
            const splitted = stdout.split("\n");
            splitted.forEach(li => {
                if (li && li.includes(" ") && li.includes("@") && !li.includes(":")) {
                    // console.log("for loop mod graph: " + li)
                    const mods = li.split(" ");
                    let from = mods[0];
                    let fromV = "Current";
                    if (from.indexOf("@") >= 0) {
                        const froms = mods[0].split("@");
                        from = froms[0];
                        fromV = froms[1];
                    }
                    const tos = mods[1].split("@");
                    const to = tos[0];
                    const toV = tos[1];
                    const edge = `[label="${fromV} -> ${toV}"]`;
                    this.g.setEdge(from, to, edge, edge); // from, to, label, name
                }
            });
        }
        catch (error) {
            if (error.code === "ENOENT") {
                vscode.window.showErrorMessage("Need run 'go mod graph' first.");
            }
            else {
                throw error;
            }
        }
    }
    async createPreview(document, column) {
        const documentDir = path.dirname(document.fileName);
        const documentDirUri = vscode.Uri.file(documentDir);
        const localResourceRoots = [this.previewDirUri, documentDirUri];
        if (vscode.workspace.workspaceFolders) {
            localResourceRoots.push(...vscode.workspace.workspaceFolders.map((f) => f.uri));
        }
        // TODO need proper progress message
        vscode.window.setStatusBarMessage("> Running 'go mod graph'...", 1000 * 10);
        await this.goModGraph(documentDir);
        await this.updateGraphText();
        let mods = this.g.nodes();
        mods.push(this.mod);
        mods.sort();
        const webviewPanel = vscode.window.createWebviewPanel(previewType, `Go mod graph: ${path.basename(document.fileName)}`, {
            preserveFocus: true,
            viewColumn: column
        }, {
            enableScripts: true,
            localResourceRoots,
            retainContextWhenHidden: true
        });
        webviewPanel.webview.html = this.previewContent.replace(/\{base-url\}/g, uriToVscodeResource(documentDirUri));
        // Add bindings.
        const messenger = messenger_1.createMessenger(new PreviewPort(webviewPanel.webview), async (message) => {
            switch (message.type) {
                case "export":
                    try {
                        // console.log("------export-----");
                        await this.exportImage(this.graphText, message.image, documentDir);
                    }
                    catch (error) {
                        await vscode.window.showErrorMessage(error.message);
                    }
                    break;
                case "mod":
                    try {
                        // console.log("------update mod--:", message.mod);
                        await this.updateModPreview(document, message.mod);
                    }
                    catch (error) {
                        await vscode.window.showErrorMessage(error.message);
                    }
                    break;
            }
        });
        const scheduler = scheduler_1.createScheduler((cancel, source) => engines.currentEngine.renderToSvg(source, documentDir, cancel), (image) => messenger({
            image,
            type: "success",
            mods: mods,
            mod: this.mod
        }), (error) => messenger({
            message: error.message,
            type: "failure"
        }));
        // Add event handlers.
        // TODO need proper progress message
        vscode.window.setStatusBarMessage(">> Rendering all mods graph...", 1000 * 10);
        const updatePreview = () => scheduler(this.graphText);
        webviewPanel.onDidDispose(() => this.previewContexts.delete(document));
        webviewPanel.onDidChangeViewState((e) => {
            if (e.webviewPanel.visible) {
                updatePreview();
            }
        });
        // Initialize.
        await messenger({ type: "initialize" });
        updatePreview();
        // Return context.
        return { webviewPanel, updatePreview };
    }
}
exports.PreviewManager = PreviewManager;
//# sourceMappingURL=previewManager.js.map