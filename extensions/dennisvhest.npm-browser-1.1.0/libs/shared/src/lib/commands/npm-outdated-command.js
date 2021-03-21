import { CommandTypes } from "./command";
var NpmOutdatedCommand = /** @class */ (function () {
    function NpmOutdatedCommand() {
        this.type = CommandTypes.npmOutdated;
        this.command = "npm outdated --json";
    }
    return NpmOutdatedCommand;
}());
export { NpmOutdatedCommand };
//# sourceMappingURL=npm-outdated-command.js.map