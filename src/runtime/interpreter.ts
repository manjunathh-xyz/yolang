import {
  Program,
  Statement,
  SayStatement,
  SetStatement,
  ConstStatement,
  CheckStatement,
  LoopStatement,
  ForStatement,
  FunctionDeclaration,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  TryStatement,
  SwitchStatement,
  ImportStatement,
  ExportStatement,
  UseStatement,
  Expression,
  LiteralExpression,
  VariableExpression,
  BinaryExpression,
  LogicalExpression,
  CallExpression,
  ArrayExpression,
  ObjectExpression,
  IndexExpression,
  NilSafeExpression,
  RangeExpression,
  TernaryExpression,
  NilCoalescingExpression,
  OptionalChainExpression,
  AwaitExpression,
  UnaryExpression,
} from '../types';
import { RuntimeError } from '../errors/RuntimeError';
import { Value, ValueType, RuntimeFn } from './values';
import { CallStack } from './stack';

export interface RuntimeOptions {
  debug?: boolean;
  trace?: boolean;
  maxSteps?: number;
  deterministic?: boolean;
}

type EmitFn = (event: string, data: any) => void;

export class Interpreter {
  private envStack: Map<string, Value>[] = [new Map()];
  private consts: Set<string> = new Set();
  private functions: Map<string, FunctionDeclaration> = new Map();
  private modules: Map<string, Map<string, Value>> = new Map();
  private stepCount = 0;

  constructor(
    private callStack: CallStack,
    private builtins: Record<string, RuntimeFn>,
    private customBuiltins: Map<string, RuntimeFn>,
    private options: RuntimeOptions,
    private emit: EmitFn
  ) {}

  private currentEnv(): Map<string, Value> {
    return this.envStack[this.envStack.length - 1];
  }

  getEnv(): Record<string, any> {
    const env = this.currentEnv();
    const result: Record<string, any> = {};
    for (const [key, value] of env) {
      result[key] = this.valueToJS(value);
    }
    return result;
  }

  loadModule(name: string, exports: Map<string, Value>): void {
    this.modules.set(name, exports);
  }

  private valueToJS(value: Value): any {
    switch (value.type) {
      case ValueType.NUMBER:
      case ValueType.STRING:
      case ValueType.BOOLEAN:
      case ValueType.NULL:
        return value.value;
      case ValueType.ARRAY:
        return value.value.map((v: any) => this.valueToJS(v as Value));
      case ValueType.OBJECT:
        const obj: Record<string, any> = {};
        for (const [k, v] of Object.entries(value.value)) {
          obj[k] = this.valueToJS(v as Value);
        }
        return obj;
      case ValueType.FUNCTION:
        return `<function>`;
    }
  }

  interpret(program: Program): Value {
    for (const stmt of program) {
      this.checkStepLimit();
      this.executeStatement(stmt);
    }
    return Value.null(); // or last value, but for now null
  }

  private checkStepLimit(): void {
    this.stepCount++;
    if (this.options.maxSteps && this.stepCount > this.options.maxSteps) {
      throw new RuntimeError(
        'Execution step limit exceeded',
        undefined,
        undefined,
        undefined,
        undefined,
        this.callStack.getStackTrace()
      );
    }
  }

  private executeStatement(stmt: Statement) {
    switch (stmt.type) {
      case 'say':
        const sayStmt = stmt as SayStatement;
        const value = this.evaluate(sayStmt.expression);
        console.log(this.valueToJS(value));
        break;
      case 'set':
        const setStmt = stmt as SetStatement;
        if (this.consts.has(setStmt.name)) {
          throw new RuntimeError(`Cannot reassign const variable '${setStmt.name}'`);
        }
        const val = this.evaluate(setStmt.expression);
        this.currentEnv().set(setStmt.name, val);
        break;
      case 'const':
        const constStmt = stmt as ConstStatement;
        if (this.consts.has(constStmt.name)) {
          throw new RuntimeError(`Const variable '${constStmt.name}' already declared`);
        }
        const constVal = this.evaluate(constStmt.expression);
        this.currentEnv().set(constStmt.name, constVal);
        this.consts.add(constStmt.name);
        break;
      case 'check':
        const checkStmt = stmt as CheckStatement;
        if (this.evaluateToBoolean(checkStmt.condition)) {
          for (const s of checkStmt.body) {
            this.executeStatement(s);
          }
        } else if (checkStmt.elseBody) {
          for (const s of checkStmt.elseBody) {
            this.executeStatement(s);
          }
        }
        break;
      case 'loop':
        const loopStmt = stmt as LoopStatement;
        while (this.evaluateToBoolean(loopStmt.condition)) {
          try {
            for (const s of loopStmt.body) {
              this.executeStatement(s);
            }
          } catch (e) {
            if (e && typeof e === 'object' && 'type' in e) {
              if ((e as any).type === 'break') break;
              if ((e as any).type === 'continue') continue;
            }
            throw e;
          }
        }
        break;
      case 'function':
        const funcStmt = stmt as FunctionDeclaration;
        this.functions.set(funcStmt.name, funcStmt);
        break;
      case 'return':
        const retStmt = stmt as ReturnStatement;
        const returnValue = retStmt.expression ? this.evaluate(retStmt.expression) : Value.null();
        throw { type: 'return', value: returnValue };
        break;
      case 'for':
        const forStmt = stmt as ForStatement;
        this.executeFor(forStmt);
        break;
      case 'break':
        throw { type: 'break' };
        break;
      case 'continue':
        throw { type: 'continue' };
        break;
      case 'try':
        const tryStmt = stmt as TryStatement;
        this.executeTry(tryStmt);
        break;
      case 'switch':
        const switchStmt = stmt as SwitchStatement;
        this.executeSwitch(switchStmt);
        break;
      case 'import':
        const importStmt = stmt as ImportStatement;
        this.executeImport(importStmt);
        break;
      case 'export':
        const exportStmt = stmt as ExportStatement;
        this.executeExport(exportStmt);
        break;
      case 'use':
        const useStmt = stmt as UseStatement;
        this.executeUse(useStmt);
        break;
    }
  }

  private evaluate(expr: Expression): Value {
    switch (expr.type) {
      case 'literal':
        const lit = expr as LiteralExpression;
        switch (lit.valueType) {
          case 'number':
            return Value.number(lit.value as number);
          case 'string':
            return Value.string(lit.value as string);
          case 'boolean':
            return Value.boolean(lit.value as boolean);
          default:
            throw new RuntimeError('Unknown literal type');
        }
      case 'variable':
        const varExpr = expr as VariableExpression;
        if (!this.currentEnv().has(varExpr.name)) {
          throw new RuntimeError(
            `Undefined variable '${varExpr.name}'`,
            undefined,
            undefined,
            undefined,
            'Make sure the variable is defined before use',
            this.callStack.getStackTrace()
          );
        }
        return this.currentEnv().get(varExpr.name)!;
      case 'binary':
        return this.evaluateBinary(expr as BinaryExpression);
      case 'call':
        return this.evaluateCall(expr as CallExpression);
      case 'array':
        const arrExpr = expr as ArrayExpression;
        const elements = arrExpr.elements.map((e) => this.evaluate(e));
        return Value.array(elements);
      case 'object':
        const objExpr = expr as ObjectExpression;
        const obj: Record<string, Value> = {};
        for (const prop of objExpr.properties) {
          obj[prop.key] = this.evaluate(prop.value);
        }
        return Value.object(obj);
      case 'index':
        return this.evaluateIndex(expr as IndexExpression);
      case 'logical':
        return this.evaluateLogical(expr as LogicalExpression);
      case 'nil-safe':
        return this.evaluateNilSafe(expr as NilSafeExpression);
      case 'range':
        return this.evaluateRange(expr as RangeExpression);
      case 'ternary':
        return this.evaluateTernary(expr as TernaryExpression);
      case 'nil-coalescing':
        return this.evaluateNilCoalescing(expr as NilCoalescingExpression);
      case 'optional-chain':
        return this.evaluateOptionalChain(expr as OptionalChainExpression);
      case 'await':
        return this.evaluateAwait(expr as AwaitExpression);
      case 'unary':
        return this.evaluateUnary(expr as UnaryExpression);
    }
  }

  private evaluateIndex(expr: IndexExpression): Value {
    const object = this.evaluate(expr.object);
    const index = this.evaluate(expr.index);

    if (object.type === ValueType.ARRAY) {
      if (index.type !== ValueType.NUMBER) {
        throw new RuntimeError('Array index must be a number');
      }
      const idx = index.value;
      if (idx < 0 || idx >= object.value.length) {
        throw new RuntimeError(
          `Cannot access index ${idx} on array of length ${object.value.length}`
        );
      }
      return object.value[idx];
    } else if (object.type === ValueType.OBJECT) {
      if (index.type !== ValueType.STRING) {
        throw new RuntimeError('Object key must be a string');
      }
      const key = index.value;
      if (!(key in object.value)) {
        const availableKeys = Object.keys(object.value).join(', ');
        throw new RuntimeError(
          `Key "${key}" does not exist on object`,
          undefined,
          undefined,
          undefined,
          `Available keys: ${availableKeys}`
        );
      }
      return object.value[key];
    } else {
      throw new RuntimeError('Can only index arrays and objects');
    }
  }

  private evaluateCall(expr: CallExpression): Value {
    // Handle built-in functions first
    if (this.isBuiltinFunction(expr.name)) {
      return this.evaluateBuiltin(expr);
    }

    const func = this.functions.get(expr.name);
    if (!func) {
      const envVal = this.currentEnv().get(expr.name);
      if (envVal && envVal.type === ValueType.FUNCTION && typeof envVal.value === 'function') {
        const fn = envVal.value as RuntimeFn;
        const args = expr.args.map((arg) => this.evaluate(arg));
        return fn(args);
      }
      throw new RuntimeError(
        `Undefined function '${expr.name}'`,
        undefined,
        undefined,
        undefined,
        undefined,
        this.callStack.getStackTrace()
      );
    }
    // Handle default and rest params
    const expectedArgs = func.params.filter((p) => !p.defaultValue).length;
    const maxArgs = func.restParam ? Infinity : func.params.length;
    if (expr.args.length < expectedArgs || expr.args.length > maxArgs) {
      throw new RuntimeError(
        `Function '${expr.name}' expects ${expectedArgs} to ${maxArgs} arguments, got ${expr.args.length}`,
        undefined,
        undefined,
        undefined,
        undefined,
        this.callStack.getStackTrace()
      );
    }
    // Create new environment
    this.callStack.push({ functionName: expr.name, line: 0, column: 0 });
    const funcEnv = new Map(this.currentEnv());
    let argIndex = 0;
    for (const param of func.params) {
      if (argIndex < expr.args.length) {
        funcEnv.set(param.name, this.evaluate(expr.args[argIndex]));
      } else if (param.defaultValue) {
        funcEnv.set(param.name, this.evaluate(param.defaultValue));
      }
      argIndex++;
    }
    if (func.restParam) {
      const restArgs = expr.args.slice(argIndex).map((arg) => this.evaluate(arg));
      funcEnv.set(func.restParam, Value.array(restArgs));
    }
    this.envStack.push(funcEnv);
    try {
      for (const stmt of func.body) {
        this.executeStatement(stmt);
      }
      const result = Value.null(); // default return
      if (this.options.trace) {
        this.emit('return', { function: expr.name, value: result.toString() });
      }
      return result;
    } catch (e) {
      if (e && typeof e === 'object' && 'type' in e && (e as any).type === 'return') {
        const result = (e as any).value || Value.null();
        if (this.options.trace) {
          this.emit('return', { function: expr.name, value: result.toString() });
        }
        return result;
      }
      throw e;
    } finally {
      this.envStack.pop();
      this.callStack.pop();
    }
  }

  private isBuiltinFunction(name: string): boolean {
    return name in this.builtins || this.customBuiltins.has(name);
  }

  private evaluateBuiltin(expr: CallExpression): Value {
    const builtin = this.builtins[expr.name] || this.customBuiltins.get(expr.name);
    if (!builtin) {
      throw new RuntimeError(`Unknown builtin function '${expr.name}'`);
    }
    const args = expr.args.map((arg) => this.evaluate(arg));
    if (this.options.trace) {
      this.emit('call', { function: expr.name, args: args.map((a) => a.toString()) });
    }
    const result = builtin(args);
    if (this.options.trace) {
      this.emit('return', { function: expr.name, value: result.toString() });
    }
    return result;
  }

  private evaluateBinary(expr: BinaryExpression): Value {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator) {
      case '+':
        if (left.type === ValueType.NUMBER && right.type === ValueType.NUMBER) {
          return Value.number(left.value + right.value);
        }
        if (left.type === ValueType.STRING || right.type === ValueType.STRING) {
          return Value.string(left.toString() + right.toString());
        }
        throw new RuntimeError('Invalid operands for +');
      case '-':
        this.checkNumbers(left, right, '-');
        return Value.number(left.value - right.value);
      case '*':
        this.checkNumbers(left, right, '*');
        return Value.number(left.value * right.value);
      case '/':
        this.checkNumbers(left, right, '/');
        return Value.number(left.value / right.value);
      case '>':
        this.checkNumbers(left, right, '>');
        return Value.boolean(left.value > right.value);
      case '<':
        this.checkNumbers(left, right, '<');
        return Value.boolean(left.value < right.value);
      case '>=':
        this.checkNumbers(left, right, '>=');
        return Value.boolean(left.value >= right.value);
      case '<=':
        this.checkNumbers(left, right, '<=');
        return Value.boolean(left.value <= right.value);
      case '==':
        return Value.boolean(left.toString() === right.toString()); // simple equality
      case '!=':
        return Value.boolean(left.toString() !== right.toString());
      default:
        throw new Error(`Unknown operator '${expr.operator}'`);
    }
  }

  private checkNumbers(left: Value, right: Value, op: string) {
    if (left.type !== ValueType.NUMBER || right.type !== ValueType.NUMBER) {
      throw new RuntimeError(`Operator '${op}' requires number operands`);
    }
  }

  private evaluateToBoolean(expr: Expression): boolean {
    const val = this.evaluate(expr);
    if (val.type === ValueType.BOOLEAN) return val.value;
    throw new RuntimeError('Condition must evaluate to boolean');
  }

  private executeFor(stmt: ForStatement): void {
    const rangeExpr = stmt.range as RangeExpression;
    if (rangeExpr.type !== 'range') {
      throw new RuntimeError('For loop range must be a range expression');
    }
    const startVal = this.evaluate(rangeExpr.start);
    const endVal = this.evaluate(rangeExpr.end);
    if (startVal.type !== ValueType.NUMBER || endVal.type !== ValueType.NUMBER) {
      throw new RuntimeError('Range start and end must be numbers');
    }
    const start = startVal.value;
    const end = endVal.value;
    for (let i = start; i <= end; i++) {
      this.currentEnv().set(stmt.variable, Value.number(i));
      try {
        for (const s of stmt.body) {
          this.executeStatement(s);
        }
      } catch (e) {
        if (e && typeof e === 'object' && 'type' in e) {
          if ((e as any).type === 'break') break;
          if ((e as any).type === 'continue') continue;
        }
        throw e;
      }
    }
  }

  private evaluateLogical(expr: LogicalExpression): Value {
    if (expr.operator === 'not') {
      const right = this.evaluate(expr.right!);
      return Value.boolean(!right.isTruthy());
    } else if (expr.operator === 'and') {
      const left = this.evaluate(expr.left);
      if (!left.isTruthy()) return Value.boolean(false);
      const right = this.evaluate(expr.right!);
      return Value.boolean(right.isTruthy());
    } else if (expr.operator === 'or') {
      const left = this.evaluate(expr.left);
      if (left.isTruthy()) return Value.boolean(true);
      const right = this.evaluate(expr.right!);
      return Value.boolean(right.isTruthy());
    }
    throw new RuntimeError(`Unknown logical operator '${expr.operator}'`);
  }

  private evaluateNilSafe(expr: NilSafeExpression): Value {
    const object = this.evaluate(expr.object);
    if (object.type === ValueType.NULL) {
      return Value.null();
    }
    if (object.type === ValueType.OBJECT) {
      if (expr.property in object.value) {
        return object.value[expr.property];
      } else {
        return Value.null();
      }
    }
    throw new RuntimeError('Nil-safe access only on objects');
  }

  private evaluateRange(expr: RangeExpression): Value {
    const startVal = this.evaluate(expr.start);
    const endVal = this.evaluate(expr.end);
    if (startVal.type !== ValueType.NUMBER || endVal.type !== ValueType.NUMBER) {
      throw new RuntimeError('Range start and end must be numbers');
    }
    const start = startVal.value;
    const end = endVal.value;
    const elements: Value[] = [];
    for (let i = start; i <= end; i++) {
      elements.push(Value.number(i));
    }
    return Value.array(elements);
  }

  private evaluateTernary(expr: TernaryExpression): Value {
    const condition = this.evaluate(expr.condition);
    if (condition.isTruthy()) {
      return this.evaluate(expr.thenBranch);
    } else {
      return this.evaluate(expr.elseBranch);
    }
  }

  private evaluateNilCoalescing(expr: NilCoalescingExpression): Value {
    const left = this.evaluate(expr.left);
    if (left.type !== ValueType.NULL) {
      return left;
    }
    return this.evaluate(expr.right);
  }

  private evaluateOptionalChain(expr: OptionalChainExpression): Value {
    const object = this.evaluate(expr.object);
    if (object.type === ValueType.NULL) {
      return Value.null();
    }
    if (object.type === ValueType.OBJECT) {
      if (expr.property in object.value) {
        return object.value[expr.property];
      } else {
        return Value.null();
      }
    }
    throw new RuntimeError('Optional chaining only on objects');
  }

  private evaluateAwait(expr: AwaitExpression): Value {
    // For now, just evaluate the expression
    // TODO: implement async runtime
    return this.evaluate(expr.expression);
  }

  private evaluateUnary(expr: UnaryExpression): Value {
    const right = this.evaluate(expr.right);
    switch (expr.operator) {
      case '-':
        if (right.type !== ValueType.NUMBER) {
          throw new RuntimeError('Unary - requires number');
        }
        return Value.number(-right.value);
      default:
        throw new RuntimeError(`Unknown unary operator '${expr.operator}'`);
    }
  }

  private executeTry(stmt: TryStatement): void {
    try {
      for (const s of stmt.tryBody) {
        this.executeStatement(s);
      }
    } catch (e) {
      if (stmt.catchBody && stmt.catchParam) {
        const catchEnv = new Map(this.currentEnv());
        catchEnv.set(
          stmt.catchParam,
          Value.string(e instanceof Error ? e.message : 'Unknown error')
        );
        this.envStack.push(catchEnv);
        try {
          for (const s of stmt.catchBody) {
            this.executeStatement(s);
          }
        } finally {
          this.envStack.pop();
        }
      } else {
        throw e;
      }
    } finally {
      if (stmt.finallyBody) {
        for (const s of stmt.finallyBody) {
          this.executeStatement(s);
        }
      }
    }
  }

  private executeSwitch(stmt: SwitchStatement): void {
    const value = this.evaluate(stmt.expression);
    for (const caseItem of stmt.cases) {
      const caseValue = this.evaluate(caseItem.value);
      if (value.toString() === caseValue.toString()) {
        for (const s of caseItem.body) {
          this.executeStatement(s);
        }
        return;
      }
    }
    if (stmt.defaultCase) {
      for (const s of stmt.defaultCase) {
        this.executeStatement(s);
      }
    }
  }

  private executeImport(stmt: ImportStatement): void {
    // For now, assume modules are loaded externally
    // In full implementation, this would load the module file
    const moduleExports = this.modules.get(stmt.module);
    if (!moduleExports) {
      throw new RuntimeError(`Module '${stmt.module}' not found`);
    }
    for (const name of stmt.names) {
      if (moduleExports.has(name)) {
        this.currentEnv().set(name, moduleExports.get(name)!);
      } else {
        throw new RuntimeError(`Export '${name}' not found in module '${stmt.module}'`);
      }
    }
  }

  private executeExport(stmt: ExportStatement): void {
    // For now, add to current module (assuming file-based)
    // In full implementation, track per-file exports
    if (!this.modules.has('current')) {
      this.modules.set('current', new Map());
    }
    const currentModule = this.modules.get('current')!;
    if (stmt.expression) {
      currentModule.set(stmt.name, this.evaluate(stmt.expression));
    } else {
      // Export existing variable
      if (this.currentEnv().has(stmt.name)) {
        currentModule.set(stmt.name, this.currentEnv().get(stmt.name)!);
      } else {
        throw new RuntimeError(`Cannot export undefined variable '${stmt.name}'`);
      }
    }
  }

  private executeUse(stmt: UseStatement): void {
    // Load module if not cached
    if (!this.modules.has(stmt.module)) {
      // For now, assume module is a file
      // TODO: implement module loading
      throw new RuntimeError(`Module '${stmt.module}' not found`);
    }
    const moduleExports = this.modules.get(stmt.module)!;
    for (const name of stmt.imports) {
      if (moduleExports.has(name)) {
        this.currentEnv().set(name, moduleExports.get(name)!);
      } else {
        throw new RuntimeError(`Export '${name}' not found in module '${stmt.module}'`);
      }
    }
  }
}
