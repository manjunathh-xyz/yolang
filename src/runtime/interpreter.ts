import { Program, Statement, SayStatement, SetStatement, CheckStatement, LoopStatement, Expression, LiteralExpression, VariableExpression, BinaryExpression } from '../types';
import { RuntimeError } from '../errors/RuntimeError';

export class Interpreter {
  private env: Map<string, any> = new Map();

  getEnv(): Record<string, any> {
    return Object.fromEntries(this.env);
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
        this.env.set(setStmt.name, val);
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
    }
  }

  private evaluate(expr: Expression): any {
    switch (expr.type) {
      case 'literal':
        const lit = expr as LiteralExpression;
        return lit.value;
      case 'variable':
        const varExpr = expr as VariableExpression;
        if (!this.env.has(varExpr.name)) {
           throw new RuntimeError(`Undefined variable '${varExpr.name}'`, undefined, undefined, undefined, 'Make sure the variable is defined before use');
         }
        return this.env.get(varExpr.name);
      case 'binary':
        return this.evaluateBinary(expr as BinaryExpression);
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