import { CommandTypes } from './command';
var NpmViewCommand = /** @class */ (function () {
    function NpmViewCommand(packageName) {
        this.type = CommandTypes.fetchPackage;
        this.command = "npm view " + packageName + " --json";
    }
    return NpmViewCommand;
}());
export { NpmViewCommand };
//# sourceMappingURL=npm-view-command.js.map