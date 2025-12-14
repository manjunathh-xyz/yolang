"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
const keywords_1 = require("../keywords");
function tokenize(source) {
    const tokens = [];
    let pos = 0;
    let line = 1;
    let column = 1;
    while (pos < source.length) {
        const char = source[pos];
        if (char === '\n') {
            tokens.push({ type: 'NEWLINE', value: '\n', line, column });
            line++;
            column = 1;
            pos++;
            continue;
        }
        if (char === ' ' || char === '\t') {
            column++;
            pos++;
            continue;
        }
        if (char === '#') {
            while (pos < source.length && source[pos] !== '\n') {
                pos++;
            }
            continue;
        }
        if (char === '"') {
            let value = '';
            pos++;
            column++;
            while (pos < source.length && source[pos] !== '"') {
                value += source[pos];
                pos++;
                column++;
            }
            if (pos >= source.length) {
                throw new Error(`Unterminated string at line ${line}, column ${column}`);
            }
            pos++;
            column++;
            tokens.push({ type: 'STRING', value, line, column: column - value.length - 2 });
            continue;
        }
        if (/\d/.test(char)) {
            let value = '';
            while (pos < source.length && /\d/.test(source[pos])) {
                value += source[pos];
                pos++;
                column++;
            }
            tokens.push({ type: 'NUMBER', value, line, column: column - value.length });
            continue;
        }
        if (/[a-zA-Z_]/.test(char)) {
            let value = '';
            while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
                value += source[pos];
                pos++;
                column++;
            }
            const type = keywords_1.keywords.includes(value) ? 'KEYWORD' : 'IDENT';
            tokens.push({ type, value, line, column: column - value.length });
            continue;
        }
        if (char === '=' && pos + 1 < source.length && source[pos + 1] === '=') {
            tokens.push({ type: 'OPERATOR', value: '==', line, column });
            pos += 2;
            column += 2;
            continue;
        }
        if (char === '!' && pos + 1 < source.length && source[pos + 1] === '=') {
            tokens.push({ type: 'OPERATOR', value: '!=', line, column });
            pos += 2;
            column += 2;
            continue;
        }
        if (char === '>' && pos + 1 < source.length && source[pos + 1] === '=') {
            tokens.push({ type: 'OPERATOR', value: '>=', line, column });
            pos += 2;
            column += 2;
            continue;
        }
        if (char === '<' && pos + 1 < source.length && source[pos + 1] === '=') {
            tokens.push({ type: 'OPERATOR', value: '<=', line, column });
            pos += 2;
            column += 2;
            continue;
        }
        if ('+-*/><='.includes(char)) {
            tokens.push({ type: 'OPERATOR', value: char, line, column });
            pos++;
            column++;
            continue;
        }
        if (char === '{') {
            tokens.push({ type: 'BLOCK_START', value: '{', line, column });
            pos++;
            column++;
            continue;
        }
        if (char === '}') {
            tokens.push({ type: 'BLOCK_END', value: '}', line, column });
            pos++;
            column++;
            continue;
        }
        throw new Error(`Unexpected character '${char}' at line ${line}, column ${column}`);
    }
    tokens.push({ type: 'EOF', value: '', line, column });
    return tokens;
}
exports.tokenize = tokenize;
