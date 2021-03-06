"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeHtml = void 0;
const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
};
function escapeHtml(source) {
    return String(source).replace(/[&<>"'\/]/g, (s) => entityMap[s]);
}
exports.escapeHtml = escapeHtml;
//# sourceMappingURL=escapeHtml.js.map