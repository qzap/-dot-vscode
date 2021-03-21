"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child = require("child_process");
class GoList {
    constructor(workingDirectory) {
        this.workingDirectory = workingDirectory;
        this.defaultOptions = {
            cwd: workingDirectory,
            encoding: 'utf8'
        };
    }
    /**
     * Return names of all packages (including vendor) that found in workingDirectory
     */
    getAllPackages() {
        const cmd = 'go list ./...';
        return new Promise(resolve => {
            child.exec(cmd, this.defaultOptions, (error, stdout, stderr) => {
                resolve(stdout.split('\n').filter(x => x.length > 0));
            });
        });
    }
    /**
     * Return packages that are in vendor folder
     */
    getVendorPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPackages = yield this.getAllPackages();
            return allPackages.filter(x => x.includes('/vendor/'));
        });
    }
    /**
     * Return packages that are not in vendor folder
     */
    getProjectPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPackages = yield this.getAllPackages();
            return allPackages.filter(x => !x.includes('/vendor/'));
        });
    }
    /**
     * Get package information
     */
    getPackageInfo(packageName) {
        const cmd = 'go list -json ' + packageName;
        return new Promise(resolve => {
            child.exec(cmd, this.defaultOptions, (error, stdout, stderr) => {
                resolve(JSON.parse(stdout));
            });
        });
    }
}
exports.GoList = GoList;
//# sourceMappingURL=go-list.js.map