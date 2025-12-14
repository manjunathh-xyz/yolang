#!/usr/bin/env node

import { readFileSync } from 'fs';
import { tokenize } from './lexer/tokenize';
import { parse } from './parser/parse';
import { Interpreter } from './runtime/interpreter';
import { reportError } from './errors/reporter';

function main() {
  console.log('🚀 Yolang v0.1.0');
  console.log('');

  const args = process.argv;
  if (args.length < 4 || args[2] !== 'run') {
    console.error('Usage: yo run <file.yo>');
    process.exit(1);
  }

  const filePath = args[3];
  let source: string;
  try {
    source = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`❌ Error: Could not read file '${filePath}'`);
    process.exit(1);
  }

  try {
    const tokens = tokenize(source);
    const program = parse(tokens);
    const interpreter = new Interpreter();
    interpreter.interpret(program);
  } catch (error) {
    reportError(error as Error, source);
    process.exit(1);
  }
}

main();