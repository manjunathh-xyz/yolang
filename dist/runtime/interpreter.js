"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const RuntimeError_1 = require("../errors/RuntimeError");
class Interpreter {
    constructor() {
        this.envStack = [new Map()];
        this.functions = new Map();
    }
    currentEnv() {
        return this.envStack[this.envStack.length - 1];
    }
    getEnv() {
        return Object.fromEntries(this.currentEnv());
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
                this.currentEnv().set(setStmt.name, val);
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
            case 'function':
                const funcStmt = stmt;
                this.functions.set(funcStmt.name, funcStmt);
                break;
            case 'return':
                const retStmt = stmt;
                const returnValue = retStmt.expression ? this.evaluate(retStmt.expression) : null;
                throw { type: 'return', value: returnValue };
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
                if (!this.currentEnv().has(varExpr.name)) {
                    throw new RuntimeError_1.RuntimeError(`Undefined variable '${varExpr.name}'`, undefined, undefined, undefined, 'Make sure the variable is defined before use');
                }
                return this.currentEnv().get(varExpr.name);
            case 'binary':
                return this.evaluateBinary(expr);
            case 'call':
                return this.evaluateCall(expr);
        }
    }
    evaluateCall(expr) {
        const func = this.functions.get(expr.name);
        if (!func) {
            throw new RuntimeError_1.RuntimeError(`Undefined function '${expr.name}'`, undefined, undefined, undefined, 'Make sure the function is defined before use');
        }
        if (expr.args.length !== func.params.length) {
            throw new RuntimeError_1.RuntimeError(`Function '${expr.name}' expects ${func.params.length} arguments, got ${expr.args.length}`);
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
        }
        catch (e) {
            if (e && typeof e === 'object' && 'type' in e && e.type === 'return') {
                return e.value;
            }
            throw e;
        }
        finally {
            this.envStack.pop();
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
                throw new RuntimeError_1.RuntimeError('Invalid operands for +');
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
        throw new RuntimeError_1.RuntimeError('Condition must evaluate to boolean');
    }
    checkNumbers(left, right, op) {
        if (typeof left !== 'number' || typeof right !== 'number') {
            throw new RuntimeError_1.RuntimeError(`Operator '${op}' requires number operands`);
        }
    }
}
exports.Interpreter = Interpreter;
