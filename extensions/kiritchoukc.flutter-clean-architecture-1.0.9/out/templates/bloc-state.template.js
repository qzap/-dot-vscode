"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
function getBlocStateTemplate(blocName, useEquatable) {
    return useEquatable
        ? getEquatableBlocStateTemplate(blocName)
        : getDefaultBlocStateTemplate(blocName);
}
exports.getBlocStateTemplate = getBlocStateTemplate;
function getEquatableBlocStateTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
abstract class ${pascalCaseBlocName}State extends Equatable {
  const ${pascalCaseBlocName}State();
}
class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {
  @override
  List<Object> get props => [];
}
`;
}
function getDefaultBlocStateTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
@immutable
abstract class ${pascalCaseBlocName}State {}
class ${pascalCaseBlocName}Initial extends ${pascalCaseBlocName}State {}
`;
}
//# sourceMappingURL=bloc-state.template.js.map