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

export interface RuntimeOptions {
  debug?: boolean;
  trace?: boolean;
  maxSteps?: number;
  deterministic?: boolean;
}

type HookCallback = (data: any) => void;

export class KexraRuntime {
  private interpreter: Interpreter;
  private callStack: CallStack;
  private customBuiltins: Map<string, RuntimeFn> = new Map();
  private hooks: Map<string, HookCallback[]> = new Map();
  private options: RuntimeOptions;

  constructor(options: RuntimeOptions = {}) {
    this.options = options;
    this.callStack = new CallStack();
    this.interpreter = new Interpreter(this.callStack, builtins, this.customBuiltins, this.options, this.emit.bind(this));
  }

  runFile(path: string): RuntimeResult {
    try {
      const source = fs.readFileSync(path, 'utf-8');
      return this.eval(source);
    } catch (error) {
      if (this.options.debug || this.options.trace) {
        this.emit('error', { message: error instanceof Error ? error.message : 'Unknown error' });
      }
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
      if (this.options.debug || this.options.trace) {
        this.emit('error', { message: error instanceof Error ? error.message : 'Unknown error' });
      }
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

  on(event: string, callback: HookCallback): void {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const callbacks = this.hooks.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}