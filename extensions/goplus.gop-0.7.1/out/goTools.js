/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolAtVersion = exports.allToolsInformation = exports.getConfiguredTools = exports.isGocode = exports.hasModSuffix = exports.getTool = exports.containsString = exports.containsTool = exports.disableModulesForWildcard = exports.getImportPathWithVersion = exports.getImportPath = void 0;
const util_1 = require("./util");
/**
 * Returns the import path for a given tool, at a given Go version.
 * @param tool 		Object of type `Tool` for the Go tool.
 * @param goVersion The current Go version.
 */
function getImportPath(tool) {
    return tool.importPath;
}
exports.getImportPath = getImportPath;
function getImportPathWithVersion(tool, version) {
    const importPath = getImportPath(tool);
    if (version) {
        return importPath + '@v' + version;
    }
    return importPath;
}
exports.getImportPathWithVersion = getImportPathWithVersion;
/**
 * Returns boolean denoting if the import path for the given tool ends with `/...`
 * and if the version of Go supports installing wildcard paths in module mode.
 * @param tool  	Object of type `Tool` for the Go tool.
 * @param goVersion The current Go version.
 */
function disableModulesForWildcard(tool, goVersion) {
    const importPath = getImportPath(tool);
    const isWildcard = importPath.endsWith('...');
    // Only Go >= 1.13 supports installing wildcards in module mode.
    return isWildcard && goVersion.lt('1.13');
}
exports.disableModulesForWildcard = disableModulesForWildcard;
function containsTool(tools, tool) {
    return tools.indexOf(tool) > -1;
}
exports.containsTool = containsTool;
function containsString(tools, toolName) {
    return tools.some((tool) => tool.name === toolName);
}
exports.containsString = containsString;
function getTool(name) {
    return exports.allToolsInformation[name];
}
exports.getTool = getTool;
// hasModSuffix returns true if the given tool has a different, module-specific
// name to avoid conflicts.
function hasModSuffix(tool) {
    return tool.name.endsWith('-gomod');
}
exports.hasModSuffix = hasModSuffix;
function isGocode(tool) {
    return tool.name === 'gocode' || tool.name === 'gocode-gomod';
}
exports.isGocode = isGocode;
function getConfiguredTools() {
    const tools = [];
    function maybeAddTool(name) {
        const tool = exports.allToolsInformation[name];
        if (tool) {
            tools.push(tool);
        }
    }
    const goPlusConfig = util_1.getGoPlusConfig();
    // Add the format tool that was chosen by the user.
    maybeAddTool(goPlusConfig['formatTool']);
    return tools;
}
exports.getConfiguredTools = getConfiguredTools;
exports.allToolsInformation = {
    'qfmt': {
        name: 'qfmt',
        importPath: 'github.com/qiniu/goplus/cmd/qfmt',
        isImportant: false,
        description: 'Formatter'
    }
};
function getToolAtVersion(name, version) {
    return Object.assign(Object.assign({}, exports.allToolsInformation[name]), { version });
}
exports.getToolAtVersion = getToolAtVersion;
//# sourceMappingURL=goTools.js.map