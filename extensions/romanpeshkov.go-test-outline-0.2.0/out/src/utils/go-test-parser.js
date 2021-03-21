"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_status_1 = require("../model/test-status");
class GoTestParser {
    constructor() {
        /**
         * regex for matching test result
         * @example "--- PASS: TestBlank (0.00s)"
         * @example "--- FAIL: TestSomething (0.00s)"
         * @example "--- SKIP: TestCaseInsentitiveGOPATH (0.00s)"
         */
        this.funcRe = /^--- (PASS|FAIL|SKIP): (\S+)\s\(.+\)$/;
        /**
         * regex for matching package test run result
         * @example "ok  	github.com/rpeshkov/multipkg/config	0.012s"
         * @example "FAIL	github.com/rpeshkov/multipkg/config	0.014s"
         */
        this.pkgRe = /^(ok|FAIL)\s+([\S,\.,\\]+)\s.+$/;
        /**
         * Map for different text statuses
         */
        this.statusMap = {
            'PASS': test_status_1.TestStatus.Passed,
            'ok': test_status_1.TestStatus.Passed,
            'FAIL': test_status_1.TestStatus.Failed,
            'SKIP': test_status_1.TestStatus.Skipped
        };
    }
    parse(input) {
        const result = new Map();
        for (const line of input.split('\n')) {
            const funcMatch = this.funcRe.exec(line);
            if (funcMatch) {
                const [, status, name] = funcMatch;
                result.set(name, this.statusMap[status]);
                continue;
            }
            const pkgMatch = this.pkgRe.exec(line);
            if (pkgMatch) {
                const [, status, name] = pkgMatch;
                result.set(name, this.statusMap[status]);
            }
        }
        return result;
    }
}
exports.GoTestParser = GoTestParser;
//# sourceMappingURL=go-test-parser.js.map