#!/usr/bin/env node

import { readFileSync } from 'fs';
import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { Interpreter } from './runtime/interpreter';
import { reportError } from './errors/reporter';
import { startRepl } from './repl/repl';
import { CliError } from './errors/CliError';

function showHelp() {
  console.log('Yolang v0.2.0');
  console.log('');
  console.log('Usage:');
  console.log('  yo run <file.yo>     Run a Yolang file');
  console.log('  yo repl              Start interactive REPL');
  console.log('  yo version           Show version');
  console.log('  yo help              Show help');
  console.log('');
  console.log('Aliases:');
  console.log('  yo -h                Same as help');
  console.log('  yo -v                Same as version');
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '-h') {
    showHelp();
    return;
  }

  if (args[0] === 'version' || args[0] === '-v') {
    console.log('Yolang v0.2.0');
    return;
  }

  if (args[0] === 'repl') {
    startRepl();
    return;
  }

  if (args[0] === 'run' && args.length === 2) {
    const filePath = args[1];
    console.log('🚀 Yolang v0.2.0');
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
      reportError(error as any, source);
      process.exit(1);
    }
    return;
  }

  showHelp();
}

main();