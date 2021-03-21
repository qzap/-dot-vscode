import * as vscode from 'vscode';
import { DependencyTreeItem } from './DependencyTreeItem';
import { DependencyGroupTreeItem } from './DependencyGroupTreeItem';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { UpdateAllPackagesTreeItem } from './UpdateAllPackagesTreeItem';
var DependencyTreeDataProvider = /** @class */ (function () {
    function DependencyTreeDataProvider(_packageJson$, _packageUpdates$, _context) {
        var _this = this;
        this._packageJson$ = _packageJson$;
        this._packageUpdates$ = _packageUpdates$;
        this._context = _context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._packageJsonSubscription = combineLatest([this._packageJson$, this._packageUpdates$]).pipe(map(function (_a) {
            var packageJson = _a[0], packageUpdates = _a[1];
            return {
                dependencies: Object.keys(packageJson.dependencies || {})
                    .map(function (dependency) { return ({ packageItem: { name: dependency, version: packageJson.dependencies[dependency] }, updates: packageUpdates[dependency] }); }),
                devDependencies: Object.keys(packageJson.devDependencies || {})
                    .map(function (dependency) { return ({ packageItem: { name: dependency, version: packageJson.devDependencies[dependency] }, updates: packageUpdates[dependency] }); }),
                optionalDependencies: Object.keys(packageJson.optionalDependencies || {})
                    .map(function (dependency) { return ({ packageItem: { name: dependency, version: packageJson.optionalDependencies[dependency] }, updates: packageUpdates[dependency] }); })
            };
        })).subscribe(function (dependencyCollection) {
            _this._dependencyCollection = dependencyCollection;
            _this._onDidChangeTreeData.fire();
        });
    }
    DependencyTreeDataProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    DependencyTreeDataProvider.prototype.getChildren = function (element) {
        var _this = this;
        if (!element) {
            var dependencies = [];
            var devDependencies = [];
            var optionalDependencies = [];
            if (this._dependencyCollection) {
                dependencies = this._dependencyCollection.dependencies
                    .map(function (dependency) { return new DependencyTreeItem(dependency.packageItem.name, dependency.packageItem.version, dependency.updates, _this._context); });
                devDependencies = this._dependencyCollection.devDependencies
                    .map(function (dependency) { return new DependencyTreeItem(dependency.packageItem.name, dependency.packageItem.version, dependency.updates, _this._context); });
                optionalDependencies = this._dependencyCollection.optionalDependencies
                    .map(function (dependency) { return new DependencyTreeItem(dependency.packageItem.name, dependency.packageItem.version, dependency.updates, _this._context); });
            }
            return [
                new UpdateAllPackagesTreeItem(this._context),
                new DependencyGroupTreeItem('Dependencies', dependencies),
                new DependencyGroupTreeItem('Development dependencies', devDependencies),
                new DependencyGroupTreeItem('Optional dependencies', optionalDependencies)
            ];
        }
        else {
            return element.children;
        }
    };
    DependencyTreeDataProvider.prototype.dispose = function () {
        this._packageJsonSubscription.unsubscribe();
    };
    return DependencyTreeDataProvider;
}());
export { DependencyTreeDataProvider };
//# sourceMappingURL=DependencyTreeDataProvider.js.map