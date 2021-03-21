"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subject {
    constructor(server) {
        this.server = server;
    }
    notify(key, data) {
        this.server.clients.forEach(ws => {
            ws.send(JSON.stringify({
                type: 'subject:' + key,
                data
            }));
        });
    }
}
exports.Subject = Subject;
