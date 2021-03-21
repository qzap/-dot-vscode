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
const changeCase = require("change-case");
const mkdirp = require("mkdirp");
const path = require("path");
const vscode_1 = require("vscode");
const fs_1 = require("fs");
const templates_1 = require("./templates");
const utils_1 = require("./utils");
function activate(_context) {
    utils_1.analyzeDependencies();
    vscode_1.commands.registerCommand("extension.new-feature", (uri) => __awaiter(this, void 0, void 0, function* () {
        // Show feature prompt
        let featureName = yield promptForFeatureName();
        // Abort if name is not valid
        if (!isNameValid(featureName)) {
            vscode_1.window.showErrorMessage("The name must not be empty");
            return;
        }
        featureName = `${featureName}`;
        let targetDirectory = "";
        try {
            targetDirectory = yield getTargetDirectory(uri);
        }
        catch (error) {
            vscode_1.window.showErrorMessage(error.message);
        }
        const useEquatable = yield promptForUseEquatable();
        const pascalCaseFeatureName = changeCase.pascalCase(featureName.toLowerCase());
        try {
            yield generateFeatureArchitecture(`${featureName}`, targetDirectory, useEquatable);
            vscode_1.window.showInformationMessage(`Successfully Generated ${pascalCaseFeatureName} Feature`);
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        }
    }));
}
exports.activate = activate;
function isNameValid(featureName) {
    // Check if feature name exists
    if (!featureName) {
        return false;
    }
    // Check if feature name is null or white space
    if (_.isNil(featureName) || featureName.trim() === "") {
        return false;
    }
    // Return true if feature name is valid
    return true;
}
exports.isNameValid = isNameValid;
function getTargetDirectory(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let targetDirectory;
        if (_.isNil(_.get(uri, "fsPath")) || !fs_1.lstatSync(uri.fsPath).isDirectory()) {
            targetDirectory = yield promptForTargetDirectory();
            if (_.isNil(targetDirectory)) {
                throw Error("Please select a valid directory");
            }
        }
        else {
            targetDirectory = uri.fsPath;
        }
        return targetDirectory;
    });
}
exports.getTargetDirectory = getTargetDirectory;
function promptForTargetDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            canSelectMany: false,
            openLabel: "Select a folder to create the feature in",
            canSelectFolders: true,
        };
        return vscode_1.window.showOpenDialog(options).then((uri) => {
            if (_.isNil(uri) || _.isEmpty(uri)) {
                return undefined;
            }
            return uri[0].fsPath;
        });
    });
}
exports.promptForTargetDirectory = promptForTargetDirectory;
function promptForFeatureName() {
    const blocNamePromptOptions = {
        prompt: "Feature Name",
        placeHolder: "login",
    };
    return vscode_1.window.showInputBox(blocNamePromptOptions);
}
exports.promptForFeatureName = promptForFeatureName;
function promptForUseEquatable() {
    return __awaiter(this, void 0, void 0, function* () {
        const useEquatablePromptValues = ["no (default)", "yes (advanced)"];
        const useEquatablePromptOptions = {
            placeHolder: "Do you want to use the Equatable Package in bloc to override equality comparisons?",
            canPickMany: false,
        };
        const answer = yield vscode_1.window.showQuickPick(useEquatablePromptValues, useEquatablePromptOptions);
        return answer === "yes (advanced)";
    });
}
exports.promptForUseEquatable = promptForUseEquatable;
function generateBlocCode(blocName, targetDirectory, useEquatable) {
    return __awaiter(this, void 0, void 0, function* () {
        const blocDirectoryPath = `${targetDirectory}/bloc`;
        if (!fs_1.existsSync(blocDirectoryPath)) {
            yield createDirectory(blocDirectoryPath);
        }
        yield Promise.all([
            createBlocEventTemplate(blocName, targetDirectory, useEquatable),
            createBlocStateTemplate(blocName, targetDirectory, useEquatable),
            createBlocTemplate(blocName, targetDirectory, useEquatable),
        ]);
    });
}
function generateFeatureArchitecture(featureName, targetDirectory, useEquatable) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the features directory if its does not exist yet
        const featuresDirectoryPath = getFeaturesDirectoryPath(targetDirectory);
        if (!fs_1.existsSync(featuresDirectoryPath)) {
            yield createDirectory(featuresDirectoryPath);
        }
        // Create the feature directory
        const featureDirectoryPath = path.join(featuresDirectoryPath, featureName);
        yield createDirectory(featureDirectoryPath);
        // Create the data layer
        const dataDirectoryPath = path.join(featureDirectoryPath, "data");
        yield createDirectories(dataDirectoryPath, [
            "datasources",
            "models",
            "repositories",
        ]);
        // Create the domain layer
        const domainDirectoryPath = path.join(featureDirectoryPath, "domain");
        yield createDirectories(domainDirectoryPath, [
            "entities",
            "repositories",
            "usecases",
        ]);
        // Create the presentation layer
        const presentationDirectoryPath = path.join(featureDirectoryPath, "presentation");
        yield createDirectories(presentationDirectoryPath, [
            "bloc",
            "pages",
            "widgets",
        ]);
        // Generate the bloc code in the presentation layer
        yield generateBlocCode(featureName, presentationDirectoryPath, useEquatable);
    });
}
exports.generateFeatureArchitecture = generateFeatureArchitecture;
function getFeaturesDirectoryPath(currentDirectory) {
    // Split the path
    const splitPath = currentDirectory.split(path.sep);
    // Remove trailing \
    if (splitPath[splitPath.length - 1] === "") {
        splitPath.pop();
    }
    // Rebuild path
    const result = splitPath.join(path.sep);
    // Determines whether we're already in the features directory or not
    const isDirectoryAlreadyFeatures = splitPath[splitPath.length - 1] === "features";
    // If already return the current directory if not, return the current directory with the /features append to it
    return isDirectoryAlreadyFeatures ? result : path.join(result, "features");
}
exports.getFeaturesDirectoryPath = getFeaturesDirectoryPath;
function createDirectories(targetDirectory, childDirectories) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the parent directory
        yield createDirectory(targetDirectory);
        // Creat the children
        childDirectories.map((directory) => __awaiter(this, void 0, void 0, function* () { return yield createDirectory(path.join(targetDirectory, directory)); }));
    });
}
exports.createDirectories = createDirectories;
function createDirectory(targetDirectory) {
    return new Promise((resolve, reject) => {
        mkdirp(targetDirectory, (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}
function createBlocEventTemplate(blocName, targetDirectory, useEquatable) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const targetPath = `${targetDirectory}/bloc/${snakeCaseBlocName}_event.dart`;
    if (fs_1.existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_event.dart already exists`);
    }
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFile(targetPath, templates_1.getBlocEventTemplate(blocName, useEquatable), "utf8", (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    }));
}
function createBlocStateTemplate(blocName, targetDirectory, useEquatable) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const targetPath = `${targetDirectory}/bloc/${snakeCaseBlocName}_state.dart`;
    if (fs_1.existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_state.dart already exists`);
    }
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFile(targetPath, templates_1.getBlocStateTemplate(blocName, useEquatable), "utf8", (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    }));
}
function createBlocTemplate(blocName, targetDirectory, useEquatable) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const targetPath = `${targetDirectory}/bloc/${snakeCaseBlocName}_bloc.dart`;
    if (fs_1.existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
    }
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fs_1.writeFile(targetPath, templates_1.getBlocTemplate(blocName, useEquatable), "utf8", (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    }));
}
//# sourceMappingURL=extension.js.map