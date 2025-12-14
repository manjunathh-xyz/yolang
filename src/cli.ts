#!/usr/bin/env node

import { readFileSync } from 'fs';
import { KexraRuntime } from './runtime/runtime';
import { reportError } from './errors/reporter';
import { startRepl } from './repl/repl';
import { CliError } from './errors/CliError';
import { KexraError } from './errors/KexraError';
import { PackageManager } from './package';

const VERSION = require('../package.json').version;
const pkgManager = new PackageManager();

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
    startRepl();
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
    // TODO: implement fmt
    console.log('Formatting files...');
    return;
  }

  if (args[0] === 'test') {
    // TODO: implement test
    console.log('Running tests...');
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

    const runtime = new KexraRuntime({ debug, trace });

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

    const result = runtime.runFile(filePath);

    if (!result.success) {
      if (debug) {
        console.error('Stack trace:');
        result.stackTrace?.forEach((frame) => {
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
