"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
class Interpreter {
    constructor() {
        this.env = new Map();
    }
    interpret(program) {
        for (const stmt of program) {
            this.executeStatement(stmt);
        }
    }
    executeStatement(stmt) {
        switch (stmt.type) {
            case 'say':
                const sayStmt = stmt;
                const value = this.evaluate(sayStmt.expression);
                console.log(value);
                break;
            case 'set':
                const setStmt = stmt;
                const val = this.evaluate(setStmt.expression);
                this.env.set(setStmt.name, val);
                break;
            case 'check':
                const checkStmt = stmt;
                if (this.evaluateToBoolean(checkStmt.condition)) {
                    for (const s of checkStmt.body) {
                        this.executeStatement(s);
                    }
                }
                else if (checkStmt.elseBody) {
                    for (const s of checkStmt.elseBody) {
                        this.executeStatement(s);
                    }
                }
                break;
            case 'loop':
                const loopStmt = stmt;
                while (this.evaluateToBoolean(loopStmt.condition)) {
                    for (const s of loopStmt.body) {
                        this.executeStatement(s);
                    }
                }
                break;
        }
    }
    evaluate(expr) {
        switch (expr.type) {
            case 'literal':
                const lit = expr;
                return lit.value;
            case 'variable':
                const varExpr = expr;
                if (!this.env.has(varExpr.name)) {
                    throw new Error(`Undefined variable '${varExpr.name}'`);
                }
                return this.env.get(varExpr.name);
            case 'binary':
                return this.evaluateBinary(expr);
        }
    }
    evaluateBinary(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator) {
            case '+':
                if (typeof left === 'number' && typeof right === 'number')
                    return left + right;
                if (typeof left === 'string' || typeof right === 'string')
                    return String(left) + String(right);
                throw new Error('Invalid operands for +');
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
    evaluateToBoolean(expr) {
        const val = this.evaluate(expr);
        if (typeof val === 'boolean')
            return val;
        throw new Error('Condition must evaluate to boolean');
    }
    checkNumbers(left, right, op) {
        if (typeof left !== 'number' || typeof right !== 'number') {
            throw new Error(`Operator '${op}' requires number operands`);
        }
    }
}
exports.Interpreter = Interpreter;
