#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const tokenize_1 = require("./lexer/tokenize");
const parse_1 = require("./parser/parse");
const interpreter_1 = require("./runtime/interpreter");
const reporter_1 = require("./errors/reporter");
function main() {
    console.log('🚀 Yolang v0.1.0');
    console.log('');
    const args = process.argv;
    if (args.length < 4 || args[2] !== 'run') {
        console.error('Usage: yo run <file.yo>');
        process.exit(1);
    }
    const filePath = args[3];
    let source;
    try {
        source = (0, fs_1.readFileSync)(filePath, 'utf-8');
    }
    catch (err) {
        console.error(`❌ Error: Could not read file '${filePath}'`);
        process.exit(1);
    }
    try {
        const tokens = (0, tokenize_1.tokenize)(source);
        const program = (0, parse_1.parse)(tokens);
        const interpreter = new interpreter_1.Interpreter();
        interpreter.interpret(program);
    }
    catch (error) {
        (0, reporter_1.reportError)(error, source);
        process.exit(1);
    }
}
main();
