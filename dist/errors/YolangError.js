"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YolangError = void 0;
class YolangError extends Error {
    constructor(message, file, line, column, hint) {
        super(message);
        this.file = file;
        this.line = line;
        this.column = column;
        this.hint = hint;
        this.name = 'YolangError';
    }
}
exports.YolangError = YolangError;
