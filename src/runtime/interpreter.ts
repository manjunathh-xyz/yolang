import { Program, Statement, SayStatement, SetStatement, CheckStatement, LoopStatement, FunctionDeclaration, ReturnStatement, Expression, LiteralExpression, VariableExpression, BinaryExpression, CallExpression } from '../types';
import { RuntimeError } from '../errors/RuntimeError';

export class Interpreter {
  private envStack: Map<string, any>[] = [new Map()];
  private functions: Map<string, FunctionDeclaration> = new Map();

  private currentEnv(): Map<string, any> {
    return this.envStack[this.envStack.length - 1];
  }

  getEnv(): Record<string, any> {
    return Object.fromEntries(this.currentEnv());
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
        console.log(value);
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

  private evaluate(expr: Expression): any {
    switch (expr.type) {
      case 'literal':
        const lit = expr as LiteralExpression;
        return lit.value;
      case 'variable':
        const varExpr = expr as VariableExpression;
        if (!this.currentEnv().has(varExpr.name)) {
           throw new RuntimeError(`Undefined variable '${varExpr.name}'`, undefined, undefined, undefined, 'Make sure the variable is defined before use');
         }
        return this.currentEnv().get(varExpr.name);
      case 'binary':
        return this.evaluateBinary(expr as BinaryExpression);
      case 'call':
        return this.evaluateCall(expr as CallExpression);
    }
  }

  private evaluateCall(expr: CallExpression): any {
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
      return null; // default return
    } catch (e) {
      if (e && typeof e === 'object' && 'type' in e && (e as any).type === 'return') {
        return (e as any).value;
      }
      throw e;
    } finally {
      this.envStack.pop();
    }
  }

  private evaluateBinary(expr: BinaryExpression): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator) {
      case '+':
         if (typeof left === 'number' && typeof right === 'number') return left + right;
         if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
         throw new RuntimeError('Invalid operands for +');
      case '-':
        this.checkNumbers(left, right, '-');
        return left - right;
      case '*':
        this.checkNumbers(left, right, '*');
        return left * right;
      case '/':
        this.checkNumbers(left, right, '/');
        return left / right;
      case '>':
        this.checkNumbers(left, right, '>');
        return left > right;
      case '<':
        this.checkNumbers(left, right, '<');
        return left < right;
      case '>=':
        this.checkNumbers(left, right, '>=');
        return left >= right;
      case '<=':
        this.checkNumbers(left, right, '<=');
        return left <= right;
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      default:
        throw new Error(`Unknown operator '${expr.operator}'`);
    }
  }

  private evaluateToBoolean(expr: Expression): boolean {
    const val = this.evaluate(expr);
    if (typeof val === 'boolean') return val;
     throw new RuntimeError('Condition must evaluate to boolean');
  }

  private checkNumbers(left: any, right: any, op: string) {
     if (typeof left !== 'number' || typeof right !== 'number') {
       throw new RuntimeError(`Operator '${op}' requires number operands`);
     }
   }
}