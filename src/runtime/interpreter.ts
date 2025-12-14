import { Program, Statement, SayStatement, SetStatement, CheckStatement, LoopStatement, FunctionDeclaration, ReturnStatement, Expression, LiteralExpression, VariableExpression, BinaryExpression, CallExpression, ArrayExpression, ObjectExpression, IndexExpression, Value } from '../types';
import { RuntimeError } from '../errors/RuntimeError';

// TODO: v0.5.0 - Complete interpreter rewrite for Value types
// - Implement evaluateArray, evaluateObject, evaluateIndex
// - Update evaluateBinary for Value types
// - Add builtin functions: len, type, print, keys, values
// - Fix environment handling for complex types
export class Interpreter {
  private envStack: Map<string, Value>[] = [new Map()];
  private functions: Map<string, FunctionDeclaration> = new Map();

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
      case 'number':
      case 'string':
      case 'boolean':
      case 'null':
        return value.value;
      case 'array':
        return value.value.map(v => this.valueToJS(v));
      case 'object':
        const obj: Record<string, any> = {};
        for (const [k, v] of value.value) {
          obj[k] = this.valueToJS(v);
        }
        return obj;
      case 'function':
        return `<function ${value.value.name}>`;
    }
  }

  interpret(program: Program) {
    for (const stmt of program) {
      this.executeStatement(stmt);
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
          for (const s of loopStmt.body) {
            this.executeStatement(s);
          }
        }
        break;
      case 'function':
        const funcStmt = stmt as FunctionDeclaration;
        this.functions.set(funcStmt.name, funcStmt);
        break;
      case 'return':
        const retStmt = stmt as ReturnStatement;
        const returnValue = retStmt.expression ? this.evaluate(retStmt.expression) : null;
        throw { type: 'return', value: returnValue };
        break;
    }
  }

  private evaluate(expr: Expression): Value {
    switch (expr.type) {
      case 'literal':
        const lit = expr as LiteralExpression;
        return { type: lit.valueType, value: lit.value } as Value;
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
        return { type: 'array', value: elements };
      case 'object':
        const objExpr = expr as ObjectExpression;
        const properties = new Map<string, Value>();
        for (const prop of objExpr.properties) {
          properties.set(prop.key, this.evaluate(prop.value));
        }
        return { type: 'object', value: properties };
      case 'index':
        return this.evaluateIndex(expr as IndexExpression);
    }
  }

  private evaluateIndex(expr: IndexExpression): Value {
    const object = this.evaluate(expr.object);
    const index = this.evaluate(expr.index);

    if (object.type === 'array') {
      if (index.type !== 'number') {
        throw new RuntimeError('Array index must be a number');
      }
      const idx = index.value;
      if (idx < 0 || idx >= object.value.length) {
        throw new RuntimeError(`Cannot access index ${idx} on array of length ${object.value.length}`);
      }
      return object.value[idx];
    } else if (object.type === 'object') {
      if (index.type !== 'string') {
        throw new RuntimeError('Object key must be a string');
      }
      const key = index.value;
      if (!object.value.has(key)) {
        const availableKeys = Array.from(object.value.keys()).join(', ');
        throw new RuntimeError(`Key "${key}" does not exist on object`, undefined, undefined, undefined, `Available keys: ${availableKeys}`);
      }
      return object.value.get(key)!;
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
      return { type: 'null', value: null } as Value; // default return
    } catch (e) {
      if (e && typeof e === 'object' && 'type' in e && (e as any).type === 'return') {
        return (e as any).value || { type: 'null', value: null } as Value;
      }
      throw e;
    } finally {
      this.envStack.pop();
    }
  }

  private isBuiltinFunction(name: string): boolean {
    return ['len', 'type', 'print', 'keys', 'values'].includes(name);
  }

  private evaluateBuiltin(expr: CallExpression): Value {
    switch (expr.name) {
      case 'len':
        if (expr.args.length !== 1) throw new RuntimeError('len() expects 1 argument');
        const arg = this.evaluate(expr.args[0]);
        if (arg.type === 'string') {
          return { type: 'number', value: arg.value.length };
        } else if (arg.type === 'array') {
          return { type: 'number', value: arg.value.length };
        } else {
          throw new RuntimeError('len() expects string or array');
        }
      case 'type':
        if (expr.args.length !== 1) throw new RuntimeError('type() expects 1 argument');
        const val = this.evaluate(expr.args[0]);
        return { type: 'string', value: val.type };
      case 'print':
        if (expr.args.length !== 1) throw new RuntimeError('print() expects 1 argument');
        const printVal = this.evaluate(expr.args[0]);
        console.log(this.valueToJS(printVal));
        return { type: 'null', value: null };
      case 'keys':
        if (expr.args.length !== 1) throw new RuntimeError('keys() expects 1 argument');
        const obj = this.evaluate(expr.args[0]);
        if (obj.type !== 'object') throw new RuntimeError('keys() expects object');
        const keys = Array.from(obj.value.keys()).map(k => ({ type: 'string' as const, value: k }));
        return { type: 'array', value: keys };
      case 'values':
        if (expr.args.length !== 1) throw new RuntimeError('values() expects 1 argument');
        const obj2 = this.evaluate(expr.args[0]);
        if (obj2.type !== 'object') throw new RuntimeError('values() expects object');
        const values = Array.from(obj2.value.values());
        return { type: 'array', value: values };
      default:
        throw new RuntimeError(`Unknown builtin function '${expr.name}'`);
    }
  }

  // TODO: v0.5.0 - Fix Value type arithmetic operations
  private evaluateBinary(expr: BinaryExpression): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator) {
      case '+':
         if (left.type === 'number' && right.type === 'number') {
           return { type: 'number', value: (left.value as number) + (right.value as number) };
         }
         if (left.type === 'string' || right.type === 'string') {
           return { type: 'string', value: String(this.valueToJS(left)) + String(this.valueToJS(right)) };
         }
         throw new RuntimeError('Invalid operands for +');
      case '-':
        this.checkNumbers(left, right, '-');
        return { type: 'number', value: (left.value as number) - (right.value as number) };
      case '*':
        this.checkNumbers(left, right, '*');
        return { type: 'number', value: (left.value as number) * (right.value as number) };
      case '/':
        this.checkNumbers(left, right, '/');
        return { type: 'number', value: (left.value as number) / (right.value as number) };
      case '>':
        this.checkNumbers(left, right, '>');
        return { type: 'boolean', value: (left.value as number) > (right.value as number) };
      case '<':
        this.checkNumbers(left, right, '<');
        return { type: 'boolean', value: (left.value as number) < (right.value as number) };
      case '>=':
        this.checkNumbers(left, right, '>=');
        return { type: 'boolean', value: (left.value as number) >= (right.value as number) };
      case '<=':
        this.checkNumbers(left, right, '<=');
        return { type: 'boolean', value: (left.value as number) <= (right.value as number) };
      case '==':
        return { type: 'boolean', value: this.valueToJS(left) === this.valueToJS(right) };
      case '!=':
        return { type: 'boolean', value: this.valueToJS(left) !== this.valueToJS(right) };
      default:
        throw new Error(`Unknown operator '${expr.operator}'`);
    }
  }

  private checkNumbers(left: Value, right: Value, op: string) {
    if (left.type !== 'number' || right.type !== 'number') {
      throw new RuntimeError(`Operator '${op}' requires number operands`);
    }
  }

  private evaluateToBoolean(expr: Expression): boolean {
    const val = this.evaluate(expr);
    if (val.type === 'boolean') return val.value;
     throw new RuntimeError('Condition must evaluate to boolean');
  }


}