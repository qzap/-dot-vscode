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
class SettingRepository {
    constructor(rawSetting, fs) {
        this.fs = fs;
        this.updateSetting(rawSetting);
    }
    updateSetting(rawSetting) {
        this.sharedStylePaths = rawSetting.sharedStyles || [];
    }
    readSharedStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            const styles = yield Promise.all(this.sharedStylePaths.map(path => this.fs.readFile(path)));
            return styles.join('\n');
        });
    }
}
exports.SettingRepository = SettingRepository;
