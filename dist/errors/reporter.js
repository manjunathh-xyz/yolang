"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportError = reportError;
function reportError(error, source) {
    console.error(`❌ ${error.name}`);
    if (error.file) {
        console.error(`File: ${error.file}`);
    }
    else if (!error.file) {
        console.error(`(REPL)`);
    }
    if (error.line !== undefined) {
        console.error(`Line: ${error.line}`);
        console.error('');
        if (source) {
            const lines = source.split('\n');
            if (error.line - 1 < lines.length) {
                const lineContent = lines[error.line - 1];
                console.error(`  ${lineContent}`);
                if (error.column !== undefined) {
                    console.error(`  ${' '.repeat(error.column - 1)}^`);
                }
            }
        }
    }
    if (error.hint) {
        console.error(`Hint: ${error.hint}`);
    }
}
