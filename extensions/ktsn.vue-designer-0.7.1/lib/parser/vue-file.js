"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const path = __importStar(require("path"));
const vue_template_compiler_1 = require("vue-template-compiler");
const vue_eslint_parser_1 = require("vue-eslint-parser");
const parser_1 = require("@babel/parser");
const postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
const hash_sum_1 = __importDefault(require("hash-sum"));
const transform_1 = require("./template/transform");
const manipulate_1 = require("./template/manipulate");
const manipulate_2 = require("./script/manipulate");
const manipulate_3 = require("./style/manipulate");
const transform_2 = require("./style/transform");
function parseVueFile(code, uri) {
    const parsedUri = new url_1.URL(uri);
    const name = path.basename(parsedUri.pathname).replace(/\..+$/, '');
    const { script, styles } = vue_template_compiler_1.parseComponent(code, { pad: 'space' });
    const { program: scriptBody } = parser_1.parse(script ? script.content : '', {
        sourceType: 'module',
        plugins: ['typescript', 'objectRestSpread']
    });
    const childComponents = manipulate_2.extractChildComponents(scriptBody, uri, childPath => {
        const resolved = new url_1.URL(parsedUri.toString());
        const dirPath = path.dirname(resolved.pathname);
        resolved.pathname = path
            .resolve(dirPath, childPath)
            .split(path.sep)
            .join('/');
        return resolved.toString();
    });
    const styleAsts = styles.map((s, i) => {
        return transform_2.transformStyle(postcss_safe_parser_1.default(s.content), s.content, i);
    });
    return {
        uri: parsedUri,
        name,
        code,
        template: parseTemplateBlock(code),
        script: scriptBody,
        props: manipulate_2.extractProps(scriptBody),
        data: manipulate_2.extractData(scriptBody),
        childComponents,
        styles: styleAsts
    };
}
exports.parseVueFile = parseVueFile;
function vueFileToPayload(vueFile, assetResolver) {
    const scopeId = hash_sum_1.default(vueFile.uri.toString());
    const basePath = path.dirname(vueFile.uri.pathname);
    return {
        uri: vueFile.uri.toString(),
        scopeId,
        template: vueFile.template &&
            manipulate_1.resolveAsset(vueFile.template, basePath, assetResolver),
        props: vueFile.props,
        data: vueFile.data,
        childComponents: vueFile.childComponents,
        styles: vueFile.styles.map(s => manipulate_3.resolveAsset(s, basePath, assetResolver))
    };
}
exports.vueFileToPayload = vueFileToPayload;
function parseTemplateBlock(template) {
    // TODO: Use parsed SFCBlock after it is fixed that the issue vue-template-compiler
    // breaks original source position by deindent
    const code = template.replace(/<script.*>[\s\S]*<\/script>/, matched => {
        return matched.replace(/./g, ' ');
    });
    const { templateBody } = vue_eslint_parser_1.parse(code, {});
    return templateBody && transform_1.transformTemplate(templateBody, code);
}
function resolveImportPath(from, to) {
    const fromPath = path.dirname(from.uri.pathname);
    const toPath = to.uri.pathname;
    const componentPath = path.relative(fromPath, toPath);
    return componentPath.startsWith('.') ? componentPath : './' + componentPath;
}
exports.resolveImportPath = resolveImportPath;
