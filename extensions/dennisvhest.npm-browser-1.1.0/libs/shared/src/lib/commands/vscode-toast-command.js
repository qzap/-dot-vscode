var ToastLevels = /** @class */ (function () {
    function ToastLevels() {
    }
    ToastLevels.info = 'info';
    ToastLevels.error = 'error';
    return ToastLevels;
}());
export { ToastLevels };
var VSCodeToastCommand = /** @class */ (function () {
    function VSCodeToastCommand(message, level) {
        if (level === void 0) { level = ToastLevels.info; }
        this.message = message;
        this.level = level;
        this.type = 'vscode-toast-command';
    }
    return VSCodeToastCommand;
}());
export { VSCodeToastCommand };
//# sourceMappingURL=vscode-toast-command.js.map