import * as fs from 'fs';
import { tokenize } from '../lexer/tokenize';
import { parse } from '../parser/parse';
import { Interpreter } from './interpreter';
import { Value } from './values';
import { CallStack, StackFrame } from './stack';
import { builtins } from './builtins';
import { RuntimeFn } from './values';

export interface RuntimeResult {
  success: boolean;
  value?: Value;
  error?: string;
  stackTrace?: StackFrame[];
}

export class KexraRuntime {
  private interpreter: Interpreter;
  private callStack: CallStack;
  private customBuiltins: Map<string, RuntimeFn> = new Map();

  constructor() {
    this.callStack = new CallStack();
    this.interpreter = new Interpreter(this.callStack, builtins, this.customBuiltins);
  }

  runFile(path: string): RuntimeResult {
    try {
      const source = fs.readFileSync(path, 'utf-8');
      return this.eval(source);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stackTrace: this.callStack.getStackTrace(),
      };
    }
  }

  eval(source: string): RuntimeResult {
    try {
      const tokens = tokenize(source);
      const program = parse(tokens);
      const result = this.interpreter.interpret(program);
      return {
        success: true,
        value: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stackTrace: this.callStack.getStackTrace(),
      };
    }
  }

  registerBuiltin(name: string, fn: RuntimeFn): void {
    this.customBuiltins.set(name, fn);
  }

  getStackTrace(): StackFrame[] {
    return this.callStack.getStackTrace();
  }

  getEnv(): Record<string, any> {
    return this.interpreter.getEnv();
  }
}