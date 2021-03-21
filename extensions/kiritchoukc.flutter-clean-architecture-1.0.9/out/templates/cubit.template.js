"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
function getCubitTemplate(cubitName, useEquatable) {
    return useEquatable
        ? getEquatableCubitTemplate(cubitName)
        : getDefaultCubitTemplate(cubitName);
}
exports.getCubitTemplate = getCubitTemplate;
function getEquatableCubitTemplate(cubitName) {
    const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
    const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
    const cubitState = `${pascalCaseCubitName}State`;
    return `import 'package:cubit/cubit.dart';
import 'package:equatable/equatable.dart';
part '${snakeCaseCubitName}_state.dart';
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}Initial());
}
`;
}
function getDefaultCubitTemplate(cubitName) {
    const pascalCaseCubitName = changeCase.pascalCase(cubitName.toLowerCase());
    const snakeCaseCubitName = changeCase.snakeCase(cubitName.toLowerCase());
    const cubitState = `${pascalCaseCubitName}State`;
    return `import 'package:cubit/cubit.dart';
import 'package:meta/meta.dart';
part '${snakeCaseCubitName}_state.dart';
class ${pascalCaseCubitName}Cubit extends Cubit<${cubitState}> {
  ${pascalCaseCubitName}Cubit() : super(${pascalCaseCubitName}Initial());
}
`;
}
//# sourceMappingURL=cubit.template.js.map