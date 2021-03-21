import * as semver from 'semver';
var InstalledPackage = /** @class */ (function () {
    function InstalledPackage(name, _version, type) {
        this.name = name;
        this._version = _version;
        this.type = type;
    }
    Object.defineProperty(InstalledPackage.prototype, "version", {
        get: function () {
            if (!this._version) {
                return null;
            }
            else {
                return new semver.Range(this._version, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    return InstalledPackage;
}());
export { InstalledPackage };
//# sourceMappingURL=installed-package.js.map