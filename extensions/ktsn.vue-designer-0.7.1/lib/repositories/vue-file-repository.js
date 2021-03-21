"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const events_1 = require("events");
const vue_file_1 = require("../parser/vue-file");
const modifier_1 = require("../parser/modifier");
const modify_1 = require("../parser/template/modify");
const modify_2 = require("../parser/script/modify");
const modify_3 = require("../parser/style/modify");
class VueFileRepository extends events_1.EventEmitter {
    constructor(fs) {
        super();
        this.fs = fs;
        this.files = new Map();
    }
    static create(initialFiles, fs) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = new VueFileRepository(fs);
            initialFiles.forEach(uri => repo.read(uri));
            return repo;
        });
    }
    get(uri) {
        return this.files.get(uri);
    }
    read(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = yield this.fs.readFile(uri);
            this.set(uri, code);
            return this.get(uri);
        });
    }
    delete(uri) {
        this.files.delete(uri);
    }
    map(fn) {
        const res = {};
        this.files.forEach((file, uri) => {
            res[uri] = fn(file, uri);
        });
        return res;
    }
    addTemplateNode(uri, insertNodeUri, path) {
        const target = this.get(uri);
        if (!target || !target.template)
            return;
        const component = this.get(insertNodeUri);
        if (!component)
            return;
        const existingComponent = target.childComponents.find(child => {
            return child.uri === component.uri.toString();
        });
        const componentName = existingComponent
            ? existingComponent.name
            : component.name;
        const modifiers = [
            modify_1.insertToTemplate(target.template, path, `<${componentName}></${componentName}>`)
        ];
        if (!existingComponent) {
            modifiers.push(modify_2.insertComponentScript(target.script, target.code, componentName, vue_file_1.resolveImportPath(target, component)));
        }
        this.modify(uri, target.code, modifiers);
    }
    addStyleDeclaration(uri, declaration, path) {
        const file = this.get(uri);
        if (!file) {
            return;
        }
        const { code, styles } = file;
        this.modify(uri, code, [modify_3.insertDeclaration(styles, declaration, path)]);
    }
    removeStyleDeclaration(uri, path) {
        const file = this.get(uri);
        if (!file) {
            return;
        }
        const { code, styles } = file;
        this.modify(uri, code, [modify_3.removeDeclaration(styles, path)]);
    }
    updateStyleDeclaration(uri, declaration) {
        const file = this.get(uri);
        if (!file) {
            return;
        }
        const { code, styles } = file;
        this.modify(uri, code, [modify_3.updateDeclaration(styles, declaration)]);
    }
    on(event, fn) {
        return super.on(event, fn);
    }
    destroy() {
        this.removeAllListeners();
    }
    set(uri, code) {
        this.files.set(uri, vue_file_1.parseVueFile(code, uri));
    }
    modify(uri, prevCode, modifiers) {
        this.set(uri, modifier_1.modify(prevCode, modifiers));
        const vueFile = this.get(uri);
        assert_1.default(vueFile, `VueFile object '${uri}' not found after saving it`);
        this.emit('update', vueFile);
        // We don't wait until the file is saved
        this.fs.modifyFile(uri, modifiers);
    }
}
exports.VueFileRepository = VueFileRepository;
