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
class ToggleCaseSensitivityCommand {
    constructor(decorationOperatorFactory, decorationPicker) {
        this.decorationOperatorFactory = decorationOperatorFactory;
        this.decorationPicker = decorationPicker;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const decorationOpt = yield this.decorationPicker.pick('Select a pattern to toggle case sensitivity');
            decorationOpt.map(decoration => {
                const decorationOperator = this.decorationOperatorFactory.createForVisibleEditors();
                decorationOperator.updateDecoration(decoration, decoration.withCaseSensitivityToggled());
            });
        });
    }
}
exports.default = ToggleCaseSensitivityCommand;
//# sourceMappingURL=toggle-case-sensitivity.js.map