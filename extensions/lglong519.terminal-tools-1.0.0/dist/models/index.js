"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const rootItems_1 = require("./rootItems");
const directives_1 = require("./directives");
const dependencies_1 = require("./dependencies");
const devDependencies_1 = require("./devDependencies");
const globalDependencies_1 = require("./globalDependencies");
exports.default = () => {
    const config = vscode_1.workspace.getConfiguration('terminal-tools');
    const libs = {
        rootItems: Object.keys(rootItems_1.default).sort(),
        directives: directives_1.default,
        dependencies: dependencies_1.default,
        devDependencies: devDependencies_1.default,
        globalDependencies: globalDependencies_1.default,
        tools: ['install vsix', 'kill port'].sort(),
    };
    Object.keys(libs).forEach(key => {
        libs[key].sort();
        if (!config[key]) {
            return;
        }
        config[key].sort();
        if (config.options[key] == 'default') {
            libs[key] = config[key].concat(libs[key]);
        }
        if (config.options[key] == 'custom') {
            libs[key] = config[key];
        }
        libs[key] = [...new Set(libs[key])];
    });
    return libs;
};
//# sourceMappingURL=index.js.map