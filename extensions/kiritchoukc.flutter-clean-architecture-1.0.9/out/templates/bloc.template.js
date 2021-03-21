"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeCase = require("change-case");
function getBlocTemplate(blocName, useEquatable) {
    return useEquatable
        ? getEquatableBlocTemplate(blocName)
        : getDefaultBlocTemplate(blocName);
}
exports.getBlocTemplate = getBlocTemplate;
function getEquatableBlocTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const blocState = `${pascalCaseBlocName}State`;
    const blocEvent = `${pascalCaseBlocName}Event`;
    return `import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial());
  @override
  Stream<${blocState}> mapEventToState(
    ${blocEvent} event,
  ) async* {
    // TODO: implement mapEventToState
  }
}
`;
}
function getDefaultBlocTemplate(blocName) {
    const pascalCaseBlocName = changeCase.pascalCase(blocName.toLowerCase());
    const snakeCaseBlocName = changeCase.snakeCase(blocName.toLowerCase());
    const blocState = `${pascalCaseBlocName}State`;
    const blocEvent = `${pascalCaseBlocName}Event`;
    return `import 'dart:async';
import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';
class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}Initial());
  @override
  Stream<${blocState}> mapEventToState(
    ${blocEvent} event,
  ) async* {
    // TODO: implement mapEventToState
  }
}
`;
}
//# sourceMappingURL=bloc.template.js.map