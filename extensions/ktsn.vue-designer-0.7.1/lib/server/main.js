"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const ws_1 = __importDefault(require("ws"));
function readContent(file, cb) {
    fs.readFile(path.join(__dirname, '..', file), 'utf8', cb);
}
const html = `<html>
<body>
  <div id="app"></div>
  <script src="/vue-designer-view.js"></script>
</body>
</html>`;
const allowedUrls = ['/vue-designer-view.js'];
function startStaticServer(assetResolver) {
    const server = http.createServer((req, res) => {
        if (req.headers.host && !/^localhost(:\d+)?$/.test(req.headers.host)) {
            res.statusCode = 403;
            res.end();
            return;
        }
        if (req.url) {
            if (req.url === '/' || req.url === '/index.html') {
                res.end(html);
                return;
            }
            const assetPath = assetResolver.urlToPath(req.url);
            if (assetPath) {
                fs.readFile(assetPath, (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.message);
                        return;
                    }
                    res.end(data);
                });
                return;
            }
            if (allowedUrls.indexOf(req.url) >= 0) {
                readContent(req.url, (err, content) => {
                    assert_1.default(!err, 'Unexpectedly file not found');
                    res.end(content);
                });
                return;
            }
        }
        res.statusCode = 404;
        res.end();
    });
    const port = process.env.DEV ? 50001 : 0;
    server.listen(port);
    return server;
}
exports.startStaticServer = startStaticServer;
function startWebSocketServer(http) {
    return new ws_1.default.Server({
        host: 'localhost',
        server: http,
        path: '/api'
    });
}
exports.startWebSocketServer = startWebSocketServer;
