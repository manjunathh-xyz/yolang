"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliError = void 0;
const YolangError_1 = require("./YolangError");
class CliError extends YolangError_1.YolangError {
    constructor(message, file, line, column, hint) {
        super(message, file, line, column, hint);
        this.name = 'CliError';
    }
}
exports.CliError = CliError;
