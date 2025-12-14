#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime/runtime");
const repl_1 = require("./repl/repl");
const package_1 = require("./package");
const VERSION = '1.20.0';
const pkgManager = new package_1.PackageManager();
function showHelp() {
    console.log(`Kexra v${VERSION}`);
    console.log('');
    console.log('Usage:');
    console.log('  kex run <file.kx>     Run a Kexra file');
    console.log('  kex repl              Start interactive REPL');
    console.log('  kex init              Initialize a new Kexra project');
    console.log('  kex install [pkg]     Install packages');
    console.log('  kex update [pkg]      Update packages');
    console.log('  kex remove <pkg>      Remove a package');
    console.log('  kex list              List installed packages');
    console.log('  kex fmt               Format Kexra files');
    console.log('  kex test              Run tests');
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
    if (args[0] === 'init') {
        pkgManager.init();
        return;
    }
    if (args[0] === 'install') {
        const pkg = args[1];
        pkgManager.install(pkg);
        return;
    }
    if (args[0] === 'update') {
        const pkg = args[1];
        pkgManager.update(pkg);
        return;
    }
    if (args[0] === 'remove') {
        const pkg = args[1];
        if (!pkg) {
            console.error('Package name required');
            process.exit(1);
        }
        pkgManager.remove(pkg);
        return;
    }
    if (args[0] === 'list') {
        pkgManager.list();
        return;
    }
    if (args[0] === 'fmt') {
        const files = args.slice(1);
        if (files.length === 0) {
            console.log('Usage: kex fmt <file.kx> [files...]');
            return;
        }
        for (const file of files) {
            // Simple formatter: just read and write back (placeholder)
            const fs = require('fs');
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf-8');
                // For now, no changes
                fs.writeFileSync(file, content);
                console.log(`Formatted ${file}`);
            }
            else {
                console.error(`File not found: ${file}`);
            }
        }
        return;
    }
    if (args[0] === 'test') {
        const fs = require('fs');
        const testFiles = fs.readdirSync('.').filter((f) => f.endsWith('.test.kx'));
        let passed = 0;
        let failed = 0;
        for (const file of testFiles) {
            try {
                const runtime = new runtime_1.KexraRuntime();
                const result = runtime.runFile(file);
                if (result.success) {
                    console.log(`✓ ${file}`);
                    passed++;
                }
                else {
                    console.log(`✗ ${file}: ${result.error}`);
                    failed++;
                }
            }
            catch (e) {
                console.log(`✗ ${file}: ${e.message}`);
                failed++;
            }
        }
        console.log(`\nPassed: ${passed}, Failed: ${failed}`);
        if (failed > 0) {
            process.exit(1);
        }
        return;
    }
    if (args[0] === 'run' && args.length >= 2) {
        const filePath = args[1];
        const flags = args.slice(2);
        const debug = flags.includes('--debug');
        const trace = flags.includes('--trace');
        const profile = flags.includes('--profile');
        console.log(`🚀 Kexra v${VERSION}`);
        console.log(`Running: ${filePath}`);
        console.log('──────────────────────────');
        const runtime = new runtime_1.KexraRuntime({ debug, trace, profile });
        if (trace) {
            runtime.on('call', (data) => {
                console.log(`→ call ${data.function}(${data.args.join(', ')})`);
            });
            runtime.on('return', (data) => {
                console.log(`→ return ${data.value}`);
            });
        }
        runtime.on('error', (data) => {
            console.error(`❌ ${data.message}`);
        });
        runtime.on('output', (data) => {
            console.log(data.value);
        });
        const result = runtime.runFile(filePath);
        if (!result.success) {
            console.error(`❌ ${result.error}`);
            if (debug) {
                console.error('Stack trace:');
                (_a = result.stackTrace) === null || _a === void 0 ? void 0 : _a.forEach((frame) => {
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
