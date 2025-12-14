"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = void 0;
const KexraError_1 = require("./KexraError");
class RuntimeError extends KexraError_1.KexraError {
    constructor(message, file, line, column, hint, stackTrace) {
        super(message, file, line, column, hint, stackTrace);
        this.name = 'RuntimeError';
    }
}
exports.RuntimeError = RuntimeError;
