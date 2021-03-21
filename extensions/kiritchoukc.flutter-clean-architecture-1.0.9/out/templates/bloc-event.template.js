"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
function getBlocEventTemplate(blocName, useEquatable) {
    return useEquatable
        ? getEquatableBlocEventTemplate(blocName)
        : getDefaultBlocEventTemplate(blocName);
}
exports.getBlocEventTemplate = getBlocEventTemplate;
function getEquatableBlocEventTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
abstract class ${pascalCaseBlocName}Event extends Equatable {
  const ${pascalCaseBlocName}Event();
}
`;
}
function getDefaultBlocEventTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    return `part of '${snakeCaseBlocName}_bloc.dart';
@immutable
abstract class ${pascalCaseBlocName}Event {}
`;
}
//# sourceMappingURL=bloc-event.template.js.map