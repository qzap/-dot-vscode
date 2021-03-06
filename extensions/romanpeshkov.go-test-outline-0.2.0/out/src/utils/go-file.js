"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const XRegExp = require("xregexp");
class GoFile {
    static getTestFunctions(filename) {
        return new Promise(resolve => {
            fs.readFile(filename, 'utf8', (err, data) => {
                /**
                 * Regex for matching valid test function.
                 * From documentation:
                 * Test is a function with signature
                 * func TestXxx(*testing.T)
                 * where Xxx can be any alphanumeric string (but the first letter must not be in [a-z]) and serves to
                 * identify the test routine.
                 *
                 * Valid test function names can be: 'Test', 'Test2', 'TestČ', 'TestSomething', 'Test_', 'Test_Hello'
                 * Invalid names (not recognized by go test): 'Testčerveny', Testsomething'
                 */
                const re = XRegExp('^func\\s+(Test([_\\d\\p{Lu}\\p{Lt}]\\p{L}*)?)\\(', 'mg');
                const functions = [];
                let found;
                while (found = re.exec(data)) {
                    functions.push(found[1]);
                }
                resolve(functions);
            });
        });
    }
}
exports.GoFile = GoFile;
//# sourceMappingURL=go-file.js.map