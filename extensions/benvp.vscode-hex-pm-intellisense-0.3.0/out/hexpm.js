"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = void 0;
const axios_1 = require("axios");
const BASE_URL = 'https://hex.pm/api';
function getPackage(name) {
    const url = `${BASE_URL}/packages/${name}`;
    return axios_1.default.get(url).then(res => res.data);
}
exports.getPackage = getPackage;
//# sourceMappingURL=hexpm.js.map