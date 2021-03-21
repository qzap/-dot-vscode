'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const go_tests_provider_1 = require("./go-tests-provider");
const go_test_1 = require("./utils/go-test");
const go_test_parser_1 = require("./utils/go-test-parser");
const CFG_SECTION = 'go-tests-outline';
let goTestsProvider;
function activate(context) {
    const config = vscode.workspace.getConfiguration(CFG_SECTION);
    const rootPath = vscode.workspace.rootPath;
    const outputChannel = vscode.window.createOutputChannel("Go Tests Outline");
    const parser = new go_test_parser_1.GoTestParser();
    const goTest = new go_test_1.GoTest(outputChannel, parser, config);
    vscode.workspace.onDidChangeConfiguration(() => {
        goTest.config = vscode.workspace.getConfiguration(CFG_SECTION);
    });
    goTestsProvider = new go_tests_provider_1.GoTestsProvider(rootPath, goTest);
    vscode.window.registerTreeDataProvider('goTests', goTestsProvider);
    vscode.commands.registerCommand('gotests.launch', (test) => __awaiter(this, void 0, void 0, function* () {
        yield goTestsProvider.launch(test);
        outputChannel.show();
    }));
    vscode.commands.registerCommand('gotests.launch_all', () => __awaiter(this, void 0, void 0, function* () {
        yield goTestsProvider.launchAll();
        outputChannel.show();
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map