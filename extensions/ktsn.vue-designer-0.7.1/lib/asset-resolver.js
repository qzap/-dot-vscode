"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const assetsEndpoint = '/assets';
// https://tools.ietf.org/html/rfc3986#section-3.1
const uriRegExp = /^\w[\w\d\+\-\.]*:/;
class AssetResolver {
    pathToUrl(assetPath, basePath) {
        // If it is full url, don't try to resolve it
        if (uriRegExp.test(assetPath)) {
            return assetPath;
        }
        const resolved = path_1.default.resolve(basePath, assetPath);
        return assetsEndpoint + '?path=' + encodeURIComponent(resolved);
    }
    urlToPath(assetUrl) {
        const url = new url_1.URL(assetUrl, 'file://');
        if (url.pathname !== assetsEndpoint) {
            return null;
        }
        const assetPath = url.searchParams.get('path');
        return assetPath && decodeURIComponent(assetPath);
    }
}
exports.AssetResolver = AssetResolver;
