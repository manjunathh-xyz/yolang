#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const tokenize_1 = require("./lexer/tokenize");
const parse_1 = require("./parser/parse");
const interpreter_1 = require("./runtime/interpreter");
const reporter_1 = require("./errors/reporter");
const repl_1 = require("./repl/repl");
const KexraError_1 = require("./errors/KexraError");
const VERSION = JSON.parse((0, fs_1.readFileSync)('./package.json', 'utf-8')).version;
function showHelp() {
    console.log(`Kexra v${VERSION}`);
    console.log('');
    console.log('Usage:');
    console.log('  kex run <file.kx>     Run a Kexra file');
    console.log('  kex repl              Start interactive REPL');
    console.log('  kex version           Show version');
    console.log('  kex help              Show help');
    console.log('');
    console.log('Aliases:');
    console.log('  kex -h                Same as help');
    console.log('  kex -v                Same as version');
}
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args[0] === 'help' || args[0] === '-h') {
        showHelp();
        return;
    }
    if (args[0] === 'version' || args[0] === '-v') {
        console.log(`Kexra v${VERSION}`);
        return;
    }
    if (args[0] === 'repl') {
        (0, repl_1.startRepl)();
        return;
    }
    if (args[0] === 'run' && args.length === 2) {
        const filePath = args[1];
        console.log(`🚀 Kexra v${VERSION}`);
        console.log(`Running: ${filePath}`);
        console.log('──────────────────────────');
        let source;
        try {
            source = (0, fs_1.readFileSync)(filePath, 'utf-8');
        }
        catch (err) {
            console.error(`❌ CliError: Could not read file '${filePath}'`);
            process.exit(1);
        }
        try {
            const tokens = (0, tokenize_1.tokenize)(source, filePath);
            const program = (0, parse_1.parse)(tokens, filePath);
            const interpreter = new interpreter_1.Interpreter();
            interpreter.interpret(program);
        }
        catch (error) {
            if (error instanceof KexraError_1.KexraError) {
                (0, reporter_1.reportError)(error, source);
            }
            else {
                console.error('Unexpected error:', error);
            }
            process.exit(1);
        }
        return;
    }
    showHelp();
}
main();
