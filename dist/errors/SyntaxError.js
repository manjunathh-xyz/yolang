"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxError = void 0;
const YolangError_1 = require("./YolangError");
class SyntaxError extends YolangError_1.YolangError {
    constructor(message, file, line, column, hint) {
        super(message, file, line, column, hint);
        this.name = 'SyntaxError';
    }
}
exports.SyntaxError = SyntaxError;
