"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const RuntimeError_1 = require("../errors/RuntimeError");
// TODO: v0.5.0 - Complete interpreter rewrite for Value types
// - Implement evaluateArray, evaluateObject, evaluateIndex
// - Update evaluateBinary for Value types
// - Add builtin functions: len, type, print, keys, values
// - Fix environment handling for complex types
class Interpreter {
    constructor() {
        this.envStack = [new Map()];
        this.functions = new Map();
    }
    currentEnv() {
        return this.envStack[this.envStack.length - 1];
    }
    getEnv() {
        const env = this.currentEnv();
        const result = {};
        for (const [key, value] of env) {
            result[key] = this.valueToJS(value);
        }
        return result;
    }
    valueToJS(value) {
        switch (value.type) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'null':
                return value.value;
            case 'array':
                return value.value.map(v => this.valueToJS(v));
            case 'object':
                const obj = {};
                for (const [k, v] of value.value) {
                    obj[k] = this.valueToJS(v);
                }
                return obj;
            case 'function':
                return `<function ${value.value.name}>`;
        }
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
                console.log(this.valueToJS(value));
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
                return { type: lit.valueType, value: lit.value };
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
            case 'array':
                const arrExpr = expr;
                const elements = arrExpr.elements.map(e => this.evaluate(e));
                return { type: 'array', value: elements };
            case 'object':
                const objExpr = expr;
                const properties = new Map();
                for (const prop of objExpr.properties) {
                    properties.set(prop.key, this.evaluate(prop.value));
                }
                return { type: 'object', value: properties };
            case 'index':
                return this.evaluateIndex(expr);
        }
    }
    evaluateIndex(expr) {
        const object = this.evaluate(expr.object);
        const index = this.evaluate(expr.index);
        if (object.type === 'array') {
            if (index.type !== 'number') {
                throw new RuntimeError_1.RuntimeError('Array index must be a number');
            }
            const idx = index.value;
            if (idx < 0 || idx >= object.value.length) {
                throw new RuntimeError_1.RuntimeError(`Cannot access index ${idx} on array of length ${object.value.length}`);
            }
            return object.value[idx];
        }
        else if (object.type === 'object') {
            if (index.type !== 'string') {
                throw new RuntimeError_1.RuntimeError('Object key must be a string');
            }
            const key = index.value;
            if (!object.value.has(key)) {
                const availableKeys = Array.from(object.value.keys()).join(', ');
                throw new RuntimeError_1.RuntimeError(`Key "${key}" does not exist on object`, undefined, undefined, undefined, `Available keys: ${availableKeys}`);
            }
            return object.value.get(key);
        }
        else {
            throw new RuntimeError_1.RuntimeError('Can only index arrays and objects');
        }
    }
    evaluateCall(expr) {
        // Handle built-in functions first
        if (this.isBuiltinFunction(expr.name)) {
            return this.evaluateBuiltin(expr);
        }
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
            return { type: 'null', value: null }; // default return
        }
        catch (e) {
            if (e && typeof e === 'object' && 'type' in e && e.type === 'return') {
                return e.value || { type: 'null', value: null };
            }
            throw e;
        }
        finally {
            this.envStack.pop();
        }
    }
    isBuiltinFunction(name) {
        return ['len', 'type', 'print', 'keys', 'values'].includes(name);
    }
    evaluateBuiltin(expr) {
        switch (expr.name) {
            case 'len':
                if (expr.args.length !== 1)
                    throw new RuntimeError_1.RuntimeError('len() expects 1 argument');
                const arg = this.evaluate(expr.args[0]);
                if (arg.type === 'string') {
                    return { type: 'number', value: arg.value.length };
                }
                else if (arg.type === 'array') {
                    return { type: 'number', value: arg.value.length };
                }
                else {
                    throw new RuntimeError_1.RuntimeError('len() expects string or array');
                }
            case 'type':
                if (expr.args.length !== 1)
                    throw new RuntimeError_1.RuntimeError('type() expects 1 argument');
                const val = this.evaluate(expr.args[0]);
                return { type: 'string', value: val.type };
            case 'print':
                if (expr.args.length !== 1)
                    throw new RuntimeError_1.RuntimeError('print() expects 1 argument');
                const printVal = this.evaluate(expr.args[0]);
                console.log(this.valueToJS(printVal));
                return { type: 'null', value: null };
            case 'keys':
                if (expr.args.length !== 1)
                    throw new RuntimeError_1.RuntimeError('keys() expects 1 argument');
                const obj = this.evaluate(expr.args[0]);
                if (obj.type !== 'object')
                    throw new RuntimeError_1.RuntimeError('keys() expects object');
                const keys = Array.from(obj.value.keys()).map(k => ({ type: 'string', value: k }));
                return { type: 'array', value: keys };
            case 'values':
                if (expr.args.length !== 1)
                    throw new RuntimeError_1.RuntimeError('values() expects 1 argument');
                const obj2 = this.evaluate(expr.args[0]);
                if (obj2.type !== 'object')
                    throw new RuntimeError_1.RuntimeError('values() expects object');
                const values = Array.from(obj2.value.values());
                return { type: 'array', value: values };
            default:
                throw new RuntimeError_1.RuntimeError(`Unknown builtin function '${expr.name}'`);
        }
    }
    // TODO: v0.5.0 - Fix Value type arithmetic operations
    evaluateBinary(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator) {
            case '+':
                if (left.type === 'number' && right.type === 'number') {
                    return { type: 'number', value: left.value + right.value };
                }
                if (left.type === 'string' || right.type === 'string') {
                    return { type: 'string', value: String(this.valueToJS(left)) + String(this.valueToJS(right)) };
                }
                throw new RuntimeError_1.RuntimeError('Invalid operands for +');
            case '-':
                this.checkNumbers(left, right, '-');
                return { type: 'number', value: left.value - right.value };
            case '*':
                this.checkNumbers(left, right, '*');
                return { type: 'number', value: left.value * right.value };
            case '/':
                this.checkNumbers(left, right, '/');
                return { type: 'number', value: left.value / right.value };
            case '>':
                this.checkNumbers(left, right, '>');
                return { type: 'boolean', value: left.value > right.value };
            case '<':
                this.checkNumbers(left, right, '<');
                return { type: 'boolean', value: left.value < right.value };
            case '>=':
                this.checkNumbers(left, right, '>=');
                return { type: 'boolean', value: left.value >= right.value };
            case '<=':
                this.checkNumbers(left, right, '<=');
                return { type: 'boolean', value: left.value <= right.value };
            case '==':
                return { type: 'boolean', value: this.valueToJS(left) === this.valueToJS(right) };
            case '!=':
                return { type: 'boolean', value: this.valueToJS(left) !== this.valueToJS(right) };
            default:
                throw new Error(`Unknown operator '${expr.operator}'`);
        }
    }
    checkNumbers(left, right, op) {
        if (left.type !== 'number' || right.type !== 'number') {
            throw new RuntimeError_1.RuntimeError(`Operator '${op}' requires number operands`);
        }
    }
    evaluateToBoolean(expr) {
        const val = this.evaluate(expr);
        if (val.type === 'boolean')
            return val.value;
        throw new RuntimeError_1.RuntimeError('Condition must evaluate to boolean');
    }
}
exports.Interpreter = Interpreter;
