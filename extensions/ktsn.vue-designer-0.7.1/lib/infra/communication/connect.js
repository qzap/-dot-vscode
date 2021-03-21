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
function connectWsServer({ resolver, mutator, server }) {
    server.on('connection', ws => {
        listenMessage(ws, resolver, mutator);
    });
}
exports.connectWsServer = connectWsServer;
function listenMessage(ws, resolver, mutator) {
    ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(message.toString());
        assert_1.default(typeof data.type === 'string');
        assert_1.default(Array.isArray(data.args));
        assert_1.default('requestId' in data);
        const [type, method] = data.type.split(':');
        const target = type === 'resolver' ? resolver : mutator;
        assert_1.default(type === 'resolver' || type === 'mutator');
        assert_1.default(typeof target[method] === 'function');
        const res = yield target[method].apply(target, data.args);
        ws.send(JSON.stringify({
            type: data.type,
            data: res,
            requestId: data.requestId
        }));
    }));
    ws.on('error', err => {
        // To avoid clashing extension by ECONNRESET error...
        // https://github.com/websockets/ws/issues/1256
        if (err.code === 'ECONNRESET')
            return;
        throw err;
    });
}
