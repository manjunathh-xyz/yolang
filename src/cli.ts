#!/usr/bin/env node

import { readFileSync } from 'fs';
import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { Interpreter } from './runtime/interpreter';
import { reportError } from './errors/reporter';
import { startRepl } from './repl/repl';
import { CliError } from './errors/CliError';
import { KexraError } from './errors/KexraError';

const VERSION = JSON.parse(readFileSync('./package.json', 'utf-8')).version;

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
    startRepl();
    return;
  }

  if (args[0] === 'run' && args.length === 2) {
    const filePath = args[1];
    console.log(`🚀 Kexra v${VERSION}`);
    console.log(`Running: ${filePath}`);
    console.log('──────────────────────────');

    let source: string;
    try {
      source = readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(`❌ CliError: Could not read file '${filePath}'`);
      process.exit(1);
    }

    try {
      const tokens = tokenize(source, filePath);
      const program = parse(tokens, filePath);
      const interpreter = new Interpreter();
      interpreter.interpret(program);
    } catch (error) {
      if (error instanceof KexraError) {
        reportError(error, source);
      } else {
        console.error('Unexpected error:', error);
      }
      process.exit(1);
    }
    return;
  }

  showHelp();
}

main();