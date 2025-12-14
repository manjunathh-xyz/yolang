#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime/runtime");
const repl_1 = require("./repl/repl");
const VERSION = require('../package.json').version;
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
    var _a;
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
    if (args[0] === 'run' && args.length >= 2) {
        const filePath = args[1];
        const flags = args.slice(2);
        const debug = flags.includes('--debug');
        const trace = flags.includes('--trace');
        console.log(`🚀 Kexra v${VERSION}`);
        console.log(`Running: ${filePath}`);
        console.log('──────────────────────────');
        const runtime = new runtime_1.KexraRuntime();
        const result = runtime.runFile(filePath);
        if (!result.success) {
            console.error(`❌ Runtime Error`);
            console.error(result.error);
            if (debug || trace) {
                console.error('Stack trace:');
                (_a = result.stackTrace) === null || _a === void 0 ? void 0 : _a.forEach(frame => {
                    console.error(`  at ${frame.functionName} (${frame.line}:${frame.column})`);
                });
            }
            process.exit(1);
        }
        return;
    }
    showHelp();
}
main();
