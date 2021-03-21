import { CommandTypes } from "./command";
var NpmUpdateCommand = /** @class */ (function () {
    function NpmUpdateCommand() {
        this.runAsVSCodeTask = true;
        this.type = CommandTypes.npmUpdate;
        this.command = "npm update";
    }
    return NpmUpdateCommand;
}());
export { NpmUpdateCommand };
//# sourceMappingURL=npm-update-command.js.map