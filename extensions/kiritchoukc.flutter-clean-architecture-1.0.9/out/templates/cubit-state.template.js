"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
function getCubitStateTemplate(cubitName, useEquatable) {
    return useEquatable
        ? getEquatableCubitStateTemplate(cubitName)
        : getDefaultCubitStateTemplate(cubitName);
}
exports.getCubitStateTemplate = getCubitStateTemplate;
function getEquatableCubitStateTemplate(cubitName) {
    const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
    const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
    return `part of '${snakeCaseCubitName}_cubit.dart';
abstract class ${pascalCaseCubitName}State extends Equatable {
  const ${pascalCaseCubitName}State();
}
class ${pascalCaseCubitName}Initial extends ${pascalCaseCubitName}State {
  @override
  List<Object> get props => [];
}
`;
}
function getDefaultCubitStateTemplate(cubitName) {
    const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
    const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
    return `part of '${snakeCaseCubitName}_cubit.dart';
@immutable
abstract class ${pascalCaseCubitName}State {}
class ${pascalCaseCubitName}Initial extends ${pascalCaseCubitName}State {}
`;
}
//# sourceMappingURL=cubit-state.template.js.map