"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const semver = require("semver");
const vscode_1 = require("vscode");
const _1 = require(".");
const update_pubspec_dependency_1 = require("./update-pubspec-dependency");
function analyzeDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        const dependenciesToAnalyze = [
            {
                name: "equatable",
                version: "^1.2.0",
                actions: [
                    {
                        name: "Open Migration Guide",
                        callback: () => {
                            vscode_1.env.openExternal(vscode_1.Uri.parse("https://github.com/felangel/equatable/blob/master/doc/migration_guides/migration-0.6.0.md"));
                        },
                    },
                ],
            },
            {
                name: "bloc",
                version: "^6.0.0",
                actions: [
                    {
                        name: "Open Migration Guide",
                        callback: () => {
                            vscode_1.env.openExternal(vscode_1.Uri.parse("https://bloclibrary.dev/#/migration"));
                        },
                    },
                ],
            },
            {
                name: "flutter_bloc",
                version: "^6.0.0",
                actions: [
                    {
                        name: "Open Migration Guide",
                        callback: () => {
                            vscode_1.env.openExternal(vscode_1.Uri.parse("https://bloclibrary.dev/#/migration"));
                        },
                    },
                ],
            },
            { name: "angular_bloc", version: "^4.0.0", actions: [] },
            {
                name: "hydrated_bloc",
                version: "^6.0.0",
                actions: [
                    {
                        name: "Open Migration Guide",
                        callback: () => {
                            vscode_1.env.openExternal(vscode_1.Uri.parse("https://bloclibrary.dev/#/migration"));
                        },
                    },
                ],
            },
            { name: "sealed_flutter_bloc", version: "^4.0.0", actions: [] },
        ];
        const devDependenciesToAnalyze = [
            {
                name: "bloc_test",
                version: "^7.0.0",
                actions: [
                    {
                        name: "Open Migration Guide",
                        callback: () => {
                            vscode_1.env.openExternal(vscode_1.Uri.parse("https://bloclibrary.dev/#/migration"));
                        },
                    },
                ],
            },
        ];
        const pubspec = yield _1.getPubspec();
        const dependencies = _.get(pubspec, "dependencies", {});
        const devDependencies = _.get(pubspec, "dev_dependencies", {});
        checkForUpgrades(dependenciesToAnalyze, dependencies);
        checkForUpgrades(devDependenciesToAnalyze, devDependencies);
    });
}
exports.analyzeDependencies = analyzeDependencies;
function checkForUpgrades(dependenciesToAnalyze, dependencies) {
    for (let i = 0; i < dependenciesToAnalyze.length; i++) {
        const dependency = dependenciesToAnalyze[i];
        if (_.has(dependencies, dependency.name)) {
            const dependencyVersion = _.get(dependencies, dependency.name, "latest");
            if (dependencyVersion === "latest")
                continue;
            if (dependencyVersion === "any")
                continue;
            if (dependencyVersion == null)
                continue;
            if (typeof dependencyVersion !== "string")
                continue;
            const minVersion = _.get(semver.minVersion(dependencyVersion), "version", "0.0.0");
            if (!semver.satisfies(minVersion, dependency.version)) {
                vscode_1.window
                    .showWarningMessage(`This workspace contains an unsupported version of ${dependency.name}. Please update to ${dependency.version}.`, ...dependency.actions.map((action) => action.name).concat("Update"))
                    .then((invokedAction) => {
                    if (invokedAction === "Update") {
                        return update_pubspec_dependency_1.updatePubspecDependency({
                            name: dependency.name,
                            latestVersion: dependency.version,
                            currentVersion: dependencyVersion,
                        });
                    }
                    const action = dependency.actions.find((action) => action.name === invokedAction);
                    if (!_.isNil(action)) {
                        action.callback();
                    }
                });
            }
        }
    }
}
//# sourceMappingURL=analyze-dependencies.js.map