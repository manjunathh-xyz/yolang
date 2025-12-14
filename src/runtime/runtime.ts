import * as fs from 'fs';
import { tokenize } from '../lexer/tokenize';
import { parse } from '../parser/parse';
import { Interpreter } from './interpreter';
import { Value } from './values';
import { CallStack, StackFrame } from './stack';
import { RuntimeError } from '../errors/RuntimeError';
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
    this.interpreter = new Interpreter(
      this.callStack,
      builtins,
      this.customBuiltins,
      this.options,
      this.emit.bind(this)
    );
    this.loadBuiltinModules();
  }

  private loadBuiltinModules(): void {
    // Load math module
    const mathExports = new Map<string, Value>();
    mathExports.set('pi', Value.number(Math.PI));
    mathExports.set(
      'sqrt',
      Value.function((args) => {
        if (args.length !== 1 || args[0].type !== 'number')
          throw new Error('sqrt expects one number');
        return Value.number(Math.sqrt(args[0].value));
      })
    );
    mathExports.set(
      'pow',
      Value.function((args) => {
        if (args.length !== 2 || args[0].type !== 'number' || args[1].type !== 'number')
          throw new Error('pow expects two numbers');
        return Value.number(Math.pow(args[0].value, args[1].value));
      })
    );
    mathExports.set(
      'abs',
      Value.function((args) => {
        if (args.length !== 1 || args[0].type !== 'number')
          throw new Error('abs expects one number');
        return Value.number(Math.abs(args[0].value));
      })
    );
    mathExports.set(
      'round',
      Value.function((args) => {
        if (args.length !== 1 || args[0].type !== 'number')
          throw new Error('round expects one number');
        return Value.number(Math.round(args[0].value));
      })
    );
    mathExports.set(
      'floor',
      Value.function((args) => {
        if (args.length !== 1 || args[0].type !== 'number')
          throw new Error('floor expects one number');
        return Value.number(Math.floor(args[0].value));
      })
    );
    mathExports.set(
      'ceil',
      Value.function((args) => {
        if (args.length !== 1 || args[0].type !== 'number')
          throw new Error('ceil expects one number');
        return Value.number(Math.ceil(args[0].value));
      })
    );
    mathExports.set(
      'random',
      Value.function((args) => {
        if (args.length !== 0) throw new Error('random expects no arguments');
        return Value.number(Math.random());
      })
    );
    this.interpreter.loadModule('math', mathExports);
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

  loadModuleFromFile(name: string, path: string): void {
    try {
      const source = fs.readFileSync(path, 'utf-8');
      const tokens = tokenize(source);
      const program = parse(tokens);
      // Run in a new interpreter instance to isolate exports
      const moduleInterpreter = new Interpreter(
        new CallStack(),
        builtins,
        this.customBuiltins,
        this.options,
        this.emit.bind(this)
      );
      moduleInterpreter.interpret(program);
      // Get exports from 'current' module
      const exports = moduleInterpreter.getModule('current');
      if (exports) {
        this.interpreter.loadModule(name, exports);
      }
    } catch (error) {
      throw new RuntimeError(
        `Failed to load module '${name}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
      callbacks.forEach((cb) => cb(data));
    }
  }
}
