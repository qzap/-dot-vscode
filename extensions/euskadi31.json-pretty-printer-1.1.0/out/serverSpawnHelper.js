"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const procPath = process.argv[2];
const procArgs = process.argv.slice(3);
console.log(`spawn('${procPath}', ${JSON.stringify(procArgs)})`);
const proc = cp.spawn(procPath, procArgs, {
    stdio: 'ignore',
    detached: true
});
proc.unref();
process.send(proc.pid);
//# sourceMappingURL=serverSpawnHelper.js.map