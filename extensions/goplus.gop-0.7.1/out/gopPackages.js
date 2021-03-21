"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/
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
exports.getAllPackages = exports.getImportablePackages = void 0;
const path = require("path");
const vscode = require("vscode");
const goPath_1 = require("./goPath");
let gopkgsNotified = false;
const allPkgsCache = new Map();
const pkgRootDirs = new Map();
let cacheTimeout = 5000;
const gopkgsSubscriptions = new Map();
const gopkgsRunning = new Set();
function gopkgs(workDir) {
    return new Promise((resolve, reject) => {
        const pkgs = new Map();
        var output = "errors;errors\nflag;flag\nfmt;fmt\nio;io\nnet;net\nos;os\nreflect;reflect\nstrconv;strconv\nstrings;strings\nsync;sync\n";
        output.split('\n').forEach((pkgDetail) => {
            const [pkgName, pkgPath] = pkgDetail.trim().split(';');
            pkgs.set(pkgPath, {
                name: pkgName,
                isStd: true
            });
        });
        return resolve(pkgs);
    });
}
/**
 * Returns mapping of import path and package name for packages that can be imported
 * Possible to return empty if useCache options is used.
 * @param filePath. Used to determine the right relative path for vendor pkgs
 * @param useCache. Force to use cache
 * @returns Map<string, string> mapping between package import path and package name
 */
function getImportablePackages(filePath, useCache = false) {
    filePath = goPath_1.fixDriveCasingInWindows(filePath);
    const fileDirPath = path.dirname(filePath);
    let foundPkgRootDir = pkgRootDirs.get(fileDirPath);
    const workDir = foundPkgRootDir || fileDirPath;
    const cache = allPkgsCache.get(workDir);
    const getAllPackagesPromise = useCache && cache ? Promise.race([getAllPackages(workDir), cache.entry]) : getAllPackages(workDir);
    return Promise.all([getAllPackagesPromise]).then(([pkgs]) => {
        const pkgMap = new Map();
        if (!pkgs) {
            return pkgMap;
        }
        // const currentWorkspace = getCurrentGoWorkspaceFromGOPATH(getCurrentGoPath(), fileDirPath);
        pkgs.forEach((info, pkgPath) => {
            if (info.name === 'main') {
                return;
            }
            pkgMap.set(pkgPath, info);
        });
        return pkgMap;
    });
}
exports.getImportablePackages = getImportablePackages;
function getAllPackagesNoCache(workDir) {
    return new Promise((resolve, reject) => {
        // Use subscription style to guard costly/long running invocation
        const callback = (pkgMap) => {
            resolve(pkgMap);
        };
        let subs = gopkgsSubscriptions.get(workDir);
        if (!subs) {
            subs = [];
            gopkgsSubscriptions.set(workDir, subs);
        }
        subs.push(callback);
        // Ensure only single gokpgs running
        if (!gopkgsRunning.has(workDir)) {
            gopkgsRunning.add(workDir);
            gopkgs(workDir).then((pkgMap) => {
                gopkgsRunning.delete(workDir);
                gopkgsSubscriptions.delete(workDir);
                subs.forEach((cb) => cb(pkgMap));
            });
        }
    });
}
/**
 * Runs gopkgs
 * @argument workDir. The workspace directory of the project.
 * @returns Map<string, string> mapping between package import path and package name
 */
function getAllPackages(workDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = allPkgsCache.get(workDir);
        const useCache = cache && new Date().getTime() - cache.lastHit < cacheTimeout;
        if (useCache) {
            cache.lastHit = new Date().getTime();
            return Promise.resolve(cache.entry);
        }
        const pkgs = yield getAllPackagesNoCache(workDir);
        if (!pkgs || pkgs.size === 0) {
            if (!gopkgsNotified) {
                vscode.window.showInformationMessage('Could not find packages. Ensure `gopkgs -format {{.Name}};{{.ImportPath}}` runs successfully.');
                gopkgsNotified = true;
            }
        }
        allPkgsCache.set(workDir, {
            entry: pkgs,
            lastHit: new Date().getTime()
        });
        return pkgs;
    });
}
exports.getAllPackages = getAllPackages;
//# sourceMappingURL=gopPackages.js.map