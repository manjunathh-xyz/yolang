 import { Program, Statement, SayStatement, SetStatement, CheckStatement, LoopStatement, ForStatement, FunctionDeclaration, ReturnStatement, BreakStatement, ContinueStatement, Expression, LiteralExpression, VariableExpression, BinaryExpression, LogicalExpression, CallExpression, ArrayExpression, ObjectExpression, IndexExpression, NilSafeExpression, RangeExpression } from '../types';
 import { RuntimeError } from '../errors/RuntimeError';
 import { Value, ValueType, RuntimeFn } from './values';
 import { CallStack } from './stack';

export class Interpreter {
  private envStack: Map<string, Value>[] = [new Map()];
  private functions: Map<string, FunctionDeclaration> = new Map();

  constructor(
    private callStack: CallStack,
    private builtins: Record<string, RuntimeFn>,
    private customBuiltins: Map<string, RuntimeFn>
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
      this.executeStatement(stmt);
    }
    return Value.null(); // or last value, but for now null
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
        const val = this.evaluate(setStmt.expression);
        this.currentEnv().set(setStmt.name, val);
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
     }
  }

  private evaluate(expr: Expression): Value {
    switch (expr.type) {
      case 'literal':
        const lit = expr as LiteralExpression;
        switch (lit.valueType) {
          case 'number': return Value.number(lit.value as number);
          case 'string': return Value.string(lit.value as string);
          case 'boolean': return Value.boolean(lit.value as boolean);
          default: throw new RuntimeError('Unknown literal type');
        }
      case 'variable':
        const varExpr = expr as VariableExpression;
        if (!this.currentEnv().has(varExpr.name)) {
           throw new RuntimeError(`Undefined variable '${varExpr.name}'`, undefined, undefined, undefined, 'Make sure the variable is defined before use');
         }
        return this.currentEnv().get(varExpr.name)!;
      case 'binary':
        return this.evaluateBinary(expr as BinaryExpression);
      case 'call':
        return this.evaluateCall(expr as CallExpression);
      case 'array':
        const arrExpr = expr as ArrayExpression;
        const elements = arrExpr.elements.map(e => this.evaluate(e));
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
        throw new RuntimeError(`Cannot access index ${idx} on array of length ${object.value.length}`);
      }
      return object.value[idx];
    } else if (object.type === ValueType.OBJECT) {
      if (index.type !== ValueType.STRING) {
        throw new RuntimeError('Object key must be a string');
      }
      const key = index.value;
      if (!(key in object.value)) {
        const availableKeys = Object.keys(object.value).join(', ');
        throw new RuntimeError(`Key "${key}" does not exist on object`, undefined, undefined, undefined, `Available keys: ${availableKeys}`);
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
      throw new RuntimeError(`Undefined function '${expr.name}'`, undefined, undefined, undefined, 'Make sure the function is defined before use');
    }
    if (expr.args.length !== func.params.length) {
      throw new RuntimeError(`Function '${expr.name}' expects ${func.params.length} arguments, got ${expr.args.length}`);
    }
    // Create new environment
    const newEnv = new Map(this.currentEnv());
    for (let i = 0; i < func.params.length; i++) {
      newEnv.set(func.params[i], this.evaluate(expr.args[i]));
    }
    this.envStack.push(newEnv);
    try {
      for (const stmt of func.body) {
        this.executeStatement(stmt);
      }
      return Value.null(); // default return
    } catch (e) {
      if (e && typeof e === 'object' && 'type' in e && (e as any).type === 'return') {
        return (e as any).value || Value.null();
      }
      throw e;
    } finally {
      this.envStack.pop();
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
    const args = expr.args.map(arg => this.evaluate(arg));
    return builtin(args);
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


}