"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const RuntimeError_1 = require("../errors/RuntimeError");
const values_1 = require("./values");
class Interpreter {
    constructor(callStack, builtins, customBuiltins, options, emit) {
        this.callStack = callStack;
        this.builtins = builtins;
        this.customBuiltins = customBuiltins;
        this.options = options;
        this.emit = emit;
        this.envStack = [new Map()];
        this.consts = new Set();
        this.functions = new Map();
        this.stepCount = 0;
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
            case values_1.ValueType.NUMBER:
            case values_1.ValueType.STRING:
            case values_1.ValueType.BOOLEAN:
            case values_1.ValueType.NULL:
                return value.value;
            case values_1.ValueType.ARRAY:
                return value.value.map((v) => this.valueToJS(v));
            case values_1.ValueType.OBJECT:
                const obj = {};
                for (const [k, v] of Object.entries(value.value)) {
                    obj[k] = this.valueToJS(v);
                }
                return obj;
            case values_1.ValueType.FUNCTION:
                return `<function>`;
        }
    }
    interpret(program) {
        for (const stmt of program) {
            this.checkStepLimit();
            this.executeStatement(stmt);
        }
        return values_1.Value.null(); // or last value, but for now null
    }
    checkStepLimit() {
        this.stepCount++;
        if (this.options.maxSteps && this.stepCount > this.options.maxSteps) {
            throw new RuntimeError_1.RuntimeError('Execution step limit exceeded');
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
                if (this.consts.has(setStmt.name)) {
                    throw new RuntimeError_1.RuntimeError(`Cannot reassign const variable '${setStmt.name}'`);
                }
                const val = this.evaluate(setStmt.expression);
                this.currentEnv().set(setStmt.name, val);
                break;
            case 'const':
                const constStmt = stmt;
                if (this.consts.has(constStmt.name)) {
                    throw new RuntimeError_1.RuntimeError(`Const variable '${constStmt.name}' already declared`);
                }
                const constVal = this.evaluate(constStmt.expression);
                this.currentEnv().set(constStmt.name, constVal);
                this.consts.add(constStmt.name);
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
                    try {
                        for (const s of loopStmt.body) {
                            this.executeStatement(s);
                        }
                    }
                    catch (e) {
                        if (e && typeof e === 'object' && 'type' in e) {
                            if (e.type === 'break')
                                break;
                            if (e.type === 'continue')
                                continue;
                        }
                        throw e;
                    }
                }
                break;
            case 'function':
                const funcStmt = stmt;
                this.functions.set(funcStmt.name, funcStmt);
                break;
            case 'return':
                const retStmt = stmt;
                const returnValue = retStmt.expression ? this.evaluate(retStmt.expression) : values_1.Value.null();
                throw { type: 'return', value: returnValue };
                break;
            case 'for':
                const forStmt = stmt;
                this.executeFor(forStmt);
                break;
            case 'break':
                throw { type: 'break' };
                break;
            case 'continue':
                throw { type: 'continue' };
                break;
            case 'try':
                const tryStmt = stmt;
                this.executeTry(tryStmt);
                break;
            case 'switch':
                const switchStmt = stmt;
                this.executeSwitch(switchStmt);
                break;
        }
    }
    evaluate(expr) {
        switch (expr.type) {
            case 'literal':
                const lit = expr;
                switch (lit.valueType) {
                    case 'number': return values_1.Value.number(lit.value);
                    case 'string': return values_1.Value.string(lit.value);
                    case 'boolean': return values_1.Value.boolean(lit.value);
                    default: throw new RuntimeError_1.RuntimeError('Unknown literal type');
                }
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
                return values_1.Value.array(elements);
            case 'object':
                const objExpr = expr;
                const obj = {};
                for (const prop of objExpr.properties) {
                    obj[prop.key] = this.evaluate(prop.value);
                }
                return values_1.Value.object(obj);
            case 'index':
                return this.evaluateIndex(expr);
            case 'logical':
                return this.evaluateLogical(expr);
            case 'nil-safe':
                return this.evaluateNilSafe(expr);
            case 'range':
                return this.evaluateRange(expr);
            case 'ternary':
                return this.evaluateTernary(expr);
            case 'nil-coalescing':
                return this.evaluateNilCoalescing(expr);
            case 'optional-chain':
                return this.evaluateOptionalChain(expr);
        }
    }
    evaluateIndex(expr) {
        const object = this.evaluate(expr.object);
        const index = this.evaluate(expr.index);
        if (object.type === values_1.ValueType.ARRAY) {
            if (index.type !== values_1.ValueType.NUMBER) {
                throw new RuntimeError_1.RuntimeError('Array index must be a number');
            }
            const idx = index.value;
            if (idx < 0 || idx >= object.value.length) {
                throw new RuntimeError_1.RuntimeError(`Cannot access index ${idx} on array of length ${object.value.length}`);
            }
            return object.value[idx];
        }
        else if (object.type === values_1.ValueType.OBJECT) {
            if (index.type !== values_1.ValueType.STRING) {
                throw new RuntimeError_1.RuntimeError('Object key must be a string');
            }
            const key = index.value;
            if (!(key in object.value)) {
                const availableKeys = Object.keys(object.value).join(', ');
                throw new RuntimeError_1.RuntimeError(`Key "${key}" does not exist on object`, undefined, undefined, undefined, `Available keys: ${availableKeys}`);
            }
            return object.value[key];
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
        // Handle default and rest params
        const expectedArgs = func.params.filter(p => !p.defaultValue).length;
        const maxArgs = func.restParam ? Infinity : func.params.length;
        if (expr.args.length < expectedArgs || expr.args.length > maxArgs) {
            throw new RuntimeError_1.RuntimeError(`Function '${expr.name}' expects ${expectedArgs} to ${maxArgs} arguments, got ${expr.args.length}`);
        }
        // Create new environment
        const funcEnv = new Map(this.currentEnv());
        let argIndex = 0;
        for (const param of func.params) {
            if (argIndex < expr.args.length) {
                funcEnv.set(param.name, this.evaluate(expr.args[argIndex]));
            }
            else if (param.defaultValue) {
                funcEnv.set(param.name, this.evaluate(param.defaultValue));
            }
            argIndex++;
        }
        if (func.restParam) {
            const restArgs = expr.args.slice(argIndex).map(arg => this.evaluate(arg));
            funcEnv.set(func.restParam, values_1.Value.array(restArgs));
        }
        this.envStack.push(funcEnv);
        try {
            for (const stmt of func.body) {
                this.executeStatement(stmt);
            }
            const result = values_1.Value.null(); // default return
            if (this.options.trace) {
                this.emit('return', { function: expr.name, value: result.toString() });
            }
            return result;
        }
        catch (e) {
            if (e && typeof e === 'object' && 'type' in e && e.type === 'return') {
                const result = e.value || values_1.Value.null();
                if (this.options.trace) {
                    this.emit('return', { function: expr.name, value: result.toString() });
                }
                return result;
            }
            throw e;
        }
        finally {
            this.envStack.pop();
        }
    }
    isBuiltinFunction(name) {
        return name in this.builtins || this.customBuiltins.has(name);
    }
    evaluateBuiltin(expr) {
        const builtin = this.builtins[expr.name] || this.customBuiltins.get(expr.name);
        if (!builtin) {
            throw new RuntimeError_1.RuntimeError(`Unknown builtin function '${expr.name}'`);
        }
        const args = expr.args.map(arg => this.evaluate(arg));
        if (this.options.trace) {
            this.emit('call', { function: expr.name, args: args.map(a => a.toString()) });
        }
        const result = builtin(args);
        if (this.options.trace) {
            this.emit('return', { function: expr.name, value: result.toString() });
        }
        return result;
    }
    evaluateBinary(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator) {
            case '+':
                if (left.type === values_1.ValueType.NUMBER && right.type === values_1.ValueType.NUMBER) {
                    return values_1.Value.number(left.value + right.value);
                }
                if (left.type === values_1.ValueType.STRING || right.type === values_1.ValueType.STRING) {
                    return values_1.Value.string(left.toString() + right.toString());
                }
                throw new RuntimeError_1.RuntimeError('Invalid operands for +');
            case '-':
                this.checkNumbers(left, right, '-');
                return values_1.Value.number(left.value - right.value);
            case '*':
                this.checkNumbers(left, right, '*');
                return values_1.Value.number(left.value * right.value);
            case '/':
                this.checkNumbers(left, right, '/');
                return values_1.Value.number(left.value / right.value);
            case '>':
                this.checkNumbers(left, right, '>');
                return values_1.Value.boolean(left.value > right.value);
            case '<':
                this.checkNumbers(left, right, '<');
                return values_1.Value.boolean(left.value < right.value);
            case '>=':
                this.checkNumbers(left, right, '>=');
                return values_1.Value.boolean(left.value >= right.value);
            case '<=':
                this.checkNumbers(left, right, '<=');
                return values_1.Value.boolean(left.value <= right.value);
            case '==':
                return values_1.Value.boolean(left.toString() === right.toString()); // simple equality
            case '!=':
                return values_1.Value.boolean(left.toString() !== right.toString());
            default:
                throw new Error(`Unknown operator '${expr.operator}'`);
        }
    }
    checkNumbers(left, right, op) {
        if (left.type !== values_1.ValueType.NUMBER || right.type !== values_1.ValueType.NUMBER) {
            throw new RuntimeError_1.RuntimeError(`Operator '${op}' requires number operands`);
        }
    }
    evaluateToBoolean(expr) {
        const val = this.evaluate(expr);
        if (val.type === values_1.ValueType.BOOLEAN)
            return val.value;
        throw new RuntimeError_1.RuntimeError('Condition must evaluate to boolean');
    }
    executeFor(stmt) {
        const rangeExpr = stmt.range;
        if (rangeExpr.type !== 'range') {
            throw new RuntimeError_1.RuntimeError('For loop range must be a range expression');
        }
        const startVal = this.evaluate(rangeExpr.start);
        const endVal = this.evaluate(rangeExpr.end);
        if (startVal.type !== values_1.ValueType.NUMBER || endVal.type !== values_1.ValueType.NUMBER) {
            throw new RuntimeError_1.RuntimeError('Range start and end must be numbers');
        }
        const start = startVal.value;
        const end = endVal.value;
        for (let i = start; i <= end; i++) {
            this.currentEnv().set(stmt.variable, values_1.Value.number(i));
            try {
                for (const s of stmt.body) {
                    this.executeStatement(s);
                }
            }
            catch (e) {
                if (e && typeof e === 'object' && 'type' in e) {
                    if (e.type === 'break')
                        break;
                    if (e.type === 'continue')
                        continue;
                }
                throw e;
            }
        }
    }
    evaluateLogical(expr) {
        if (expr.operator === 'not') {
            const right = this.evaluate(expr.right);
            return values_1.Value.boolean(!right.isTruthy());
        }
        else if (expr.operator === 'and') {
            const left = this.evaluate(expr.left);
            if (!left.isTruthy())
                return values_1.Value.boolean(false);
            const right = this.evaluate(expr.right);
            return values_1.Value.boolean(right.isTruthy());
        }
        else if (expr.operator === 'or') {
            const left = this.evaluate(expr.left);
            if (left.isTruthy())
                return values_1.Value.boolean(true);
            const right = this.evaluate(expr.right);
            return values_1.Value.boolean(right.isTruthy());
        }
        throw new RuntimeError_1.RuntimeError(`Unknown logical operator '${expr.operator}'`);
    }
    evaluateNilSafe(expr) {
        const object = this.evaluate(expr.object);
        if (object.type === values_1.ValueType.NULL) {
            return values_1.Value.null();
        }
        if (object.type === values_1.ValueType.OBJECT) {
            if (expr.property in object.value) {
                return object.value[expr.property];
            }
            else {
                return values_1.Value.null();
            }
        }
        throw new RuntimeError_1.RuntimeError('Nil-safe access only on objects');
    }
    evaluateRange(expr) {
        const startVal = this.evaluate(expr.start);
        const endVal = this.evaluate(expr.end);
        if (startVal.type !== values_1.ValueType.NUMBER || endVal.type !== values_1.ValueType.NUMBER) {
            throw new RuntimeError_1.RuntimeError('Range start and end must be numbers');
        }
        const start = startVal.value;
        const end = endVal.value;
        const elements = [];
        for (let i = start; i <= end; i++) {
            elements.push(values_1.Value.number(i));
        }
        return values_1.Value.array(elements);
    }
    evaluateTernary(expr) {
        const condition = this.evaluate(expr.condition);
        if (condition.isTruthy()) {
            return this.evaluate(expr.thenBranch);
        }
        else {
            return this.evaluate(expr.elseBranch);
        }
    }
    evaluateNilCoalescing(expr) {
        const left = this.evaluate(expr.left);
        if (left.type !== values_1.ValueType.NULL) {
            return left;
        }
        return this.evaluate(expr.right);
    }
    evaluateOptionalChain(expr) {
        const object = this.evaluate(expr.object);
        if (object.type === values_1.ValueType.NULL) {
            return values_1.Value.null();
        }
        if (object.type === values_1.ValueType.OBJECT) {
            if (expr.property in object.value) {
                return object.value[expr.property];
            }
            else {
                return values_1.Value.null();
            }
        }
        throw new RuntimeError_1.RuntimeError('Optional chaining only on objects');
    }
    executeTry(stmt) {
        try {
            for (const s of stmt.tryBody) {
                this.executeStatement(s);
            }
        }
        catch (e) {
            if (stmt.catchBody && stmt.catchParam) {
                const catchEnv = new Map(this.currentEnv());
                catchEnv.set(stmt.catchParam, values_1.Value.string(e instanceof Error ? e.message : 'Unknown error'));
                this.envStack.push(catchEnv);
                try {
                    for (const s of stmt.catchBody) {
                        this.executeStatement(s);
                    }
                }
                finally {
                    this.envStack.pop();
                }
            }
            else {
                throw e;
            }
        }
        finally {
            if (stmt.finallyBody) {
                for (const s of stmt.finallyBody) {
                    this.executeStatement(s);
                }
            }
        }
    }
    executeSwitch(stmt) {
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
}
exports.Interpreter = Interpreter;
