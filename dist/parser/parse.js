"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
exports.parse = parse;
const SyntaxError_1 = require("../errors/SyntaxError");
class Parser {
    constructor(tokens, filePath) {
        this.current = 0;
        this.tokens = tokens;
        this.filePath = filePath;
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            if (this.peek().type === 'NEWLINE') {
                this.advance();
                continue;
            }
            statements.push(this.parseStatement());
        }
        return statements;
    }
    parseStatement() {
        const token = this.peek();
        if (token.type === 'KEYWORD') {
            switch (token.value) {
                case 'say':
                    return this.parseSay();
                case 'set':
                    return this.parseSet();
                case 'const':
                    return this.parseConst();
                case 'check':
                    return this.parseCheck();
                case 'loop':
                    return this.parseLoop();
                case 'for':
                    return this.parseFor();
                case 'fn':
                    return this.parseFunction();
                case 'return':
                    return this.parseReturn();
                case 'break':
                    return this.parseBreak();
                case 'continue':
                    return this.parseContinue();
                case 'try':
                    return this.parseTry();
                case 'switch':
                    return this.parseSwitch();
                case 'import':
                    return this.parseImport();
                case 'export':
                    return this.parseExport();
                case 'use':
                    return this.parseUse();
                default:
                    throw this.error(token, `Unexpected keyword '${token.value}'`);
            }
        }
        throw this.error(token, 'Expected statement');
    }
    parseSay() {
        this.advance(); // consume 'say'
        const expr = this.parseExpression();
        this.expectNewline();
        return { type: 'say', expression: expr };
    }
    parseSet() {
        this.advance(); // 'set'
        const name = this.consume('IDENT', 'Expected variable name').value;
        const opToken = this.consume('OPERATOR', 'Expected =');
        if (opToken.value !== '=') {
            throw new SyntaxError_1.SyntaxError('Expected =', this.filePath, opToken.line, opToken.column, 'Use "=" for assignment, not "=="');
        }
        const expr = this.parseExpression();
        this.expectNewline();
        return { type: 'set', name, expression: expr };
    }
    parseCheck() {
        this.advance(); // 'check'
        const condition = this.parseExpression();
        this.consume('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        let elseBody;
        if (this.match('KEYWORD', 'else')) {
            this.consume('BLOCK_START', 'Expected { after else');
            elseBody = this.parseBlock();
        }
        return { type: 'check', condition, body, elseBody };
    }
    parseLoop() {
        this.advance(); // 'loop'
        const condition = this.parseExpression();
        this.consume('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'loop', condition, body };
    }
    parseFunction() {
        this.advance(); // 'fn'
        const name = this.consume('IDENT', 'Expected function name').value;
        this.consume('OPERATOR', 'Expected (', '(');
        const params = [];
        let restParam;
        if (!this.check('OPERATOR', ')')) {
            do {
                const paramName = this.consume('IDENT', 'Expected parameter name').value;
                let defaultValue;
                if (this.match('OPERATOR', '=')) {
                    defaultValue = this.parseExpression();
                }
                params.push({ name: paramName, defaultValue });
            } while (this.match('OPERATOR', ','));
            if (this.match('OPERATOR', '...')) {
                restParam = this.consume('IDENT', 'Expected rest parameter name').value;
            }
        }
        this.consume('OPERATOR', 'Expected )', ')');
        this.consume('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'function', name, params, restParam, body };
    }
    parseReturn() {
        this.advance(); // 'return'
        let expression;
        if (!this.check('NEWLINE') && !this.isAtEnd()) {
            expression = this.parseExpression();
        }
        this.expectNewline();
        return { type: 'return', expression };
    }
    parseFor() {
        this.advance(); // 'for'
        const variable = this.consume('IDENT', 'Expected variable name').value;
        this.consume('KEYWORD', 'Expected in', 'in');
        const range = this.parseExpression();
        this.consume('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'for', variable, range, body };
    }
    parseBreak() {
        this.advance(); // 'break'
        this.expectNewline();
        return { type: 'break' };
    }
    parseContinue() {
        this.advance(); // 'continue'
        this.expectNewline();
        return { type: 'continue' };
    }
    parseConst() {
        this.advance(); // 'const'
        const name = this.consume('IDENT', 'Expected variable name').value;
        this.consume('OPERATOR', 'Expected =', '=');
        const expression = this.parseExpression();
        this.expectNewline();
        return { type: 'const', name, expression };
    }
    parseTry() {
        this.advance(); // 'try'
        this.consume('BLOCK_START', 'Expected { after try');
        const tryBody = this.parseBlock();
        let catchParam;
        let catchBody;
        if (this.match('KEYWORD', 'catch')) {
            this.consume('OPERATOR', 'Expected ( after catch', '(');
            catchParam = this.consume('IDENT', 'Expected catch parameter').value;
            this.consume('OPERATOR', 'Expected )', ')');
            this.consume('BLOCK_START', 'Expected { after catch');
            catchBody = this.parseBlock();
        }
        let finallyBody;
        if (this.match('KEYWORD', 'finally')) {
            this.consume('BLOCK_START', 'Expected { after finally');
            finallyBody = this.parseBlock();
        }
        return { type: 'try', tryBody, catchParam, catchBody, finallyBody };
    }
    parseSwitch() {
        this.advance(); // 'switch'
        const expression = this.parseExpression();
        this.consume('BLOCK_START', 'Expected { after switch');
        const cases = [];
        let defaultCase;
        while (!this.check('BLOCK_END') && !this.isAtEnd()) {
            if (this.match('KEYWORD', 'case')) {
                const value = this.parseExpression();
                this.consume('BLOCK_START', 'Expected { after case value');
                const body = this.parseBlock();
                cases.push({ value, body });
            }
            else if (this.match('KEYWORD', 'default')) {
                this.consume('BLOCK_START', 'Expected { after default');
                defaultCase = this.parseBlock();
            }
            else {
                throw this.error(this.peek(), 'Expected case or default in switch');
            }
        }
        this.consume('BLOCK_END', 'Expected } after switch');
        return { type: 'switch', expression, cases, defaultCase };
    }
    parseImport() {
        this.advance(); // 'import'
        this.consume('OPERATOR', 'Expected { after import', '{');
        const names = [];
        if (!this.check('OPERATOR', '}')) {
            do {
                names.push(this.consume('IDENT', 'Expected identifier').value);
            } while (this.match('OPERATOR', ','));
        }
        this.consume('OPERATOR', 'Expected }', '}');
        this.consume('KEYWORD', 'Expected from', 'from');
        const module = this.consume('STRING', 'Expected module path').value;
        this.expectNewline();
        return { type: 'import', names, module };
    }
    parseExport() {
        this.advance(); // 'export'
        const name = this.expectIdentifier('Expected identifier after export').value;
        let expression;
        if (this.peek().type !== 'NEWLINE') {
            expression = this.parseExpression();
        }
        this.expectNewline();
        return { type: 'export', name, expression };
    }
    parseUse() {
        this.advance(); // 'use'
        const module = this.expectIdentifier('Expected module name after use').value;
        this.skipNewlines();
        this.expect('BLOCK_START', 'Expected { after module name');
        this.skipNewlines();
        const imports = [];
        while (!this.check('BLOCK_END')) {
            const ident = this.expectIdentifier('Expected identifier in import list');
            imports.push(ident.value);
            this.skipNewlines();
            if (!this.check('BLOCK_END')) {
                this.expect('OPERATOR', ',', 'Expected , or }');
                this.skipNewlines();
            }
        }
        this.advance(); // consume }
        this.expectNewline();
        return { type: 'use', module, imports };
    }
    parseBlock() {
        const statements = [];
        while (!this.check('BLOCK_END') && !this.isAtEnd()) {
            if (this.peek().type === 'NEWLINE') {
                this.advance();
                continue;
            }
            statements.push(this.parseStatement());
        }
        this.consume('BLOCK_END', 'Expected }');
        return statements;
    }
    parseExpression() {
        return this.parseTernary();
    }
    parseTernary() {
        const expr = this.parseNilCoalescing();
        if (this.match('OPERATOR', '?')) {
            const thenBranch = this.parseExpression();
            this.consume('OPERATOR', 'Expected : in ternary', ':');
            const elseBranch = this.parseTernary(); // right associative
            return { type: 'ternary', condition: expr, thenBranch, elseBranch };
        }
        return expr;
    }
    parseNilCoalescing() {
        const expr = this.parseLogical();
        if (this.match('OPERATOR', '??')) {
            const right = this.parseNilCoalescing();
            return { type: 'nil-coalescing', left: expr, right };
        }
        return expr;
    }
    parseLogical() {
        let expr = this.parseEquality();
        while (this.match('KEYWORD', 'and', 'or')) {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expr = { type: 'logical', left: expr, operator, right };
        }
        return expr;
    }
    parseEquality() {
        let expr = this.parseComparison();
        while (this.match('OPERATOR', '==', '!=')) {
            const operator = this.previous().value;
            const right = this.parseComparison();
            expr = { type: 'binary', left: expr, operator, right };
        }
        return expr;
    }
    parseComparison() {
        let expr = this.parseTerm();
        while (this.match('OPERATOR', '>', '<', '>=', '<=')) {
            const operator = this.previous().value;
            const right = this.parseTerm();
            expr = { type: 'binary', left: expr, operator, right };
        }
        return expr;
    }
    parseTerm() {
        let expr = this.parseRange();
        while (this.match('OPERATOR', '+', '-')) {
            const operator = this.previous().value;
            const right = this.parseRange();
            expr = { type: 'binary', left: expr, operator, right };
        }
        return expr;
    }
    parseRange() {
        let expr = this.parseFactor();
        if (this.match('OPERATOR', '..')) {
            const start = expr;
            const end = this.parseFactor();
            expr = { type: 'range', start, end };
        }
        return expr;
    }
    parseFactor() {
        let expr = this.parseUnary();
        while (this.match('OPERATOR', '*', '/')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expr = { type: 'binary', left: expr, operator, right };
        }
        return expr;
    }
    parseUnary() {
        if (this.match('KEYWORD', 'not')) {
            const operator = 'not';
            const right = this.parseUnary();
            return { type: 'logical', operator, right };
        }
        if (this.match('OPERATOR', '-')) {
            const operator = '-';
            const right = this.parseUnary();
            return { type: 'unary', operator, right };
        }
        if (this.match('KEYWORD', 'await')) {
            const expression = this.parseUnary();
            return { type: 'await', expression };
        }
        return this.parsePrimary();
    }
    // TODO: v0.5.0 - Add parsing for arrays [], objects {}, and indexing []
    parsePrimary() {
        if (this.match('NUMBER')) {
            return {
                type: 'literal',
                valueType: 'number',
                value: parseFloat(this.previous().value),
            };
        }
        if (this.match('STRING')) {
            return {
                type: 'literal',
                valueType: 'string',
                value: this.previous().value,
            };
        }
        if (this.match('KEYWORD', 'true')) {
            return { type: 'literal', valueType: 'boolean', value: true };
        }
        if (this.match('KEYWORD', 'false')) {
            return { type: 'literal', valueType: 'boolean', value: false };
        }
        if (this.match('OPERATOR', '[')) {
            return this.parseArray();
        }
        if (this.match('OPERATOR', '{')) {
            return this.parseObject();
        }
        if (this.match('IDENT')) {
            return this.parseIdentifierOrCall();
        }
        if (this.match('OPERATOR', '(')) {
            const expr = this.parseExpression();
            this.consume('OPERATOR', 'Expected )', ')');
            return expr;
        }
        throw this.error(this.peek(), 'Expected expression');
    }
    parseArray() {
        const elements = [];
        if (!this.check('OPERATOR', ']')) {
            do {
                elements.push(this.parseExpression());
            } while (this.match('OPERATOR', ','));
        }
        this.consume('OPERATOR', 'Expected ]', ']');
        return { type: 'array', elements };
    }
    parseObject() {
        const properties = [];
        if (!this.check('OPERATOR', '}')) {
            do {
                const key = this.consume('IDENT', 'Expected property name').value;
                this.consume('OPERATOR', 'Expected :', ':');
                const value = this.parseExpression();
                properties.push({ key, value });
            } while (this.match('OPERATOR', ','));
        }
        this.consume('OPERATOR', 'Expected }', '}');
        return { type: 'object', properties };
    }
    parseIdentifierOrCall() {
        const name = this.previous().value;
        let expr = { type: 'variable', name };
        // Handle indexing
        while (this.match('OPERATOR', '[')) {
            const index = this.parseExpression();
            this.consume('OPERATOR', 'Expected ]', ']');
            expr = { type: 'index', object: expr, index };
        }
        // Handle optional chaining
        if (this.match('OPERATOR', '?')) {
            this.consume('OPERATOR', 'Expected . after ?', '.');
            const property = this.consume('IDENT', 'Expected property name').value;
            expr = { type: 'optional-chain', object: expr, property };
        }
        // Handle function calls
        if (this.match('OPERATOR', '(')) {
            const args = [];
            if (!this.check('OPERATOR', ')')) {
                do {
                    args.push(this.parseExpression());
                } while (this.match('OPERATOR', ','));
            }
            this.consume('OPERATOR', 'Expected )', ')');
            expr = { type: 'call', name, args };
        }
        return expr;
    }
    match(type, ...values) {
        if (this.check(type, ...values)) {
            this.advance();
            return true;
        }
        return false;
    }
    check(type, ...values) {
        if (this.isAtEnd())
            return false;
        const token = this.peek();
        if (token.type !== type)
            return false;
        if (values.length > 0 && !values.includes(token.value))
            return false;
        return true;
    }
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    isAtEnd() {
        return this.peek().type === 'EOF';
    }
    consume(type, message, ...values) {
        if (this.check(type, ...values))
            return this.advance();
        throw this.error(this.peek(), message);
    }
    expect(type, valueOrMessage, message) {
        if (this.check(type)) {
            const token = this.peek();
            if (message === undefined) {
                // valueOrMessage is message
                return this.advance();
            }
            else {
                // valueOrMessage is value
                if (token.value === valueOrMessage)
                    return this.advance();
                throw this.error(token, message);
            }
        }
        throw this.error(this.peek(), message || valueOrMessage);
    }
    skipNewlines() {
        while (!this.isAtEnd() && this.peek().type === 'NEWLINE') {
            this.advance();
        }
    }
    expectIdentifier(message) {
        if (this.peek().type === 'IDENT')
            return this.advance();
        throw this.error(this.peek(), message);
    }
    expectNewline() {
        if (!this.isAtEnd() && this.peek().type !== 'NEWLINE' && this.peek().type !== 'BLOCK_END') {
            throw this.error(this.peek(), 'Expected newline');
        }
        if (!this.isAtEnd() && this.peek().type === 'NEWLINE')
            this.advance();
    }
    error(token, message) {
        throw new SyntaxError_1.SyntaxError(message, this.filePath, token.line, token.column);
    }
}
exports.Parser = Parser;
function parse(tokens, filePath) {
    const parser = new Parser(tokens, filePath);
    return parser.parse();
}
