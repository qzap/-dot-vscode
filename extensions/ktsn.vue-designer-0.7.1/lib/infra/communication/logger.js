"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function enableLogging(ws) {
    return {
        get clients() {
            return new Set(Array.from(ws.clients.values()).map(enableSocketLogging));
        },
        on(event, fn) {
            ws.on(event, socket => {
                if (event === 'connection') {
                    console.log(`----- ${formattedNow()} New connection appears`);
                }
                fn(enableSocketLogging(socket));
            });
        }
    };
}
exports.enableLogging = enableLogging;
function enableSocketLogging(socket) {
    return {
        on(event, fn) {
            socket.on(event, payload => {
                fn(payload);
                if (event === 'message') {
                    console.log(`<===  ${formattedNow()}`, JSON.parse(payload));
                }
                else if (event === 'error') {
                    console.log(`ERROR ${formattedNow()}`, payload);
                }
            });
        },
        once(event, fn) {
            socket.once(event, () => {
                fn();
            });
        },
        send(payload) {
            socket.send(payload);
            console.log(`===>  ${formattedNow()}`, JSON.parse(payload));
        }
    };
}
function formattedNow() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now
        .getDate()
        .toString()
        .padStart(2, '0');
    const hour = now
        .getHours()
        .toString()
        .padStart(2, '0');
    const minute = now
        .getMinutes()
        .toString()
        .padStart(2, '0');
    const second = now
        .getSeconds()
        .toString()
        .padStart(2, '0');
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}
