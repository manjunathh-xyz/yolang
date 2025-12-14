"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
exports.parse = parse;
class Parser {
    constructor(tokens, filePath) {
        this.current = 0;
        this.tokens = tokens;
        this.filePath = filePath;
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd() && this.peek().type !== 'EOF') {
            statements.push(this.parseStatement());
        }
        return statements;
    }
    parseStatement() {
        this.skipNewlines();
        if (this.match('KEYWORD', 'say')) {
            return this.parseSay();
        }
        if (this.match('KEYWORD', 'set')) {
            return this.parseSet();
        }
        if (this.match('KEYWORD', 'const')) {
            return this.parseConst();
        }
        if (this.match('KEYWORD', 'check')) {
            return this.parseCheck();
        }
        if (this.match('KEYWORD', 'loop')) {
            return this.parseLoop();
        }
        if (this.match('KEYWORD', 'for')) {
            return this.parseFor();
        }
        if (this.match('KEYWORD', 'fn')) {
            return this.parseFunction();
        }
        if (this.match('KEYWORD', 'return')) {
            return this.parseReturn();
        }
        if (this.match('KEYWORD', 'break')) {
            return this.parseBreak();
        }
        if (this.match('KEYWORD', 'continue')) {
            return this.parseContinue();
        }
        if (this.match('KEYWORD', 'try')) {
            return this.parseTry();
        }
        if (this.match('KEYWORD', 'switch')) {
            return this.parseSwitch();
        }
        if (this.match('KEYWORD', 'import')) {
            return this.parseImport();
        }
        if (this.match('KEYWORD', 'export')) {
            return this.parseExport();
        }
        if (this.match('KEYWORD', 'use')) {
            return this.parseUse();
        }
        throw this.error(this.peek(), 'Expected statement');
    }
    parseSay() {
        const expression = this.parseExpression();
        this.expectNewline();
        return { type: 'say', expression };
    }
    parseSet() {
        const name = this.expectIdentifier('Expected variable name').value;
        this.expect('OPERATOR', '=', 'Expected =');
        const expression = this.parseExpression();
        this.expectNewline();
        return { type: 'set', name, expression };
    }
    parseConst() {
        const name = this.expectIdentifier('Expected variable name').value;
        this.expect('OPERATOR', '=', 'Expected =');
        const expression = this.parseExpression();
        this.expectNewline();
        return { type: 'const', name, expression };
    }
    parseCheck() {
        const condition = this.parseExpression();
        this.expect('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        let elseBody;
        if (this.match('KEYWORD', 'else')) {
            this.expect('BLOCK_START', 'Expected {');
            elseBody = this.parseBlock();
        }
        return { type: 'check', condition, body, elseBody };
    }
    parseLoop() {
        const condition = this.parseExpression();
        this.expect('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'loop', condition, body };
    }
    parseFor() {
        const variable = this.expectIdentifier('Expected variable name').value;
        this.expect('KEYWORD', 'in', 'Expected in');
        const iterable = this.parseExpression();
        this.expect('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'for', variable, iterable, body };
    }
    parseFunction() {
        const name = this.expectIdentifier('Expected function name').value;
        this.expect('OPERATOR', '(', 'Expected (');
        const params = [];
        if (!this.check('OPERATOR', ')')) {
            do {
                const paramName = this.expectIdentifier('Expected parameter name').value;
                params.push({ name: paramName });
            } while (this.match('OPERATOR', ','));
        }
        this.expect('OPERATOR', ')', 'Expected )');
        this.expect('BLOCK_START', 'Expected {');
        const body = this.parseBlock();
        return { type: 'function', name, params, body };
    }
    parseReturn() {
        let expression;
        if (!this.checkNewline()) {
            expression = this.parseExpression();
        }
        this.expectNewline();
        return { type: 'return', expression };
    }
    parseBreak() {
        this.expectNewline();
        return { type: 'break' };
    }
    parseContinue() {
        this.expectNewline();
        return { type: 'continue' };
    }
    parseTry() {
        this.expect('BLOCK_START', 'Expected {');
        const tryBody = this.parseBlock();
        this.expect('KEYWORD', 'catch', 'Expected catch');
        const catchParam = this.expectIdentifier('Expected catch parameter').value;
        this.expect('BLOCK_START', 'Expected {');
        const catchBody = this.parseBlock();
        let finallyBody;
        if (this.match('KEYWORD', 'finally')) {
            this.expect('BLOCK_START', 'Expected {');
            finallyBody = this.parseBlock();
        }
        return { type: 'try', tryBody, catchParam, catchBody, finallyBody };
    }
    parseSwitch() {
        const expression = this.parseExpression();
        this.expect('BLOCK_START', 'Expected {');
        const cases = [];
        while (this.match('KEYWORD', 'case')) {
            const value = this.parseExpression();
            this.expect('OPERATOR', ':', 'Expected :');
            const body = this.parseBlock();
            cases.push({ value, body });
        }
        let defaultBody;
        if (this.match('KEYWORD', 'default')) {
            this.expect('OPERATOR', ':', 'Expected :');
            defaultBody = this.parseBlock();
        }
        this.expect('BLOCK_END', 'Expected }');
        return { type: 'switch', expression, cases, defaultBody };
    }
    parseImport() {
        const name = this.expectIdentifier('Expected module name').value;
        this.expectNewline();
        return { type: 'import', name };
    }
    parseExport() {
        const name = this.expectIdentifier('Expected export name').value;
        let expression;
        if (!this.checkNewline()) {
            expression = this.parseExpression();
        }
        this.expectNewline();
        return { type: 'export', name, expression };
    }
    parseUse() {
        const module = this.expectIdentifier('Expected module name').value;
        this.skipNewlines();
        this.expect('BLOCK_START', 'Expected {');
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
            statements.push(this.parseStatement());
        }
        this.expect('BLOCK_END', 'Expected }');
        return statements;
    }
    parseExpression() {
        return this.parseTernary();
    }
    parseTernary() {
        let expression = this.parseLogical();
        if (this.match('OPERATOR', '?')) {
            const thenBranch = this.parseExpression();
            this.expect('OPERATOR', ':', 'Expected :');
            const elseBranch = this.parseTernary();
            expression = { type: 'ternary', condition: expression, thenBranch, elseBranch };
        }
        return expression;
    }
    parseLogical() {
        let expression = this.parseEquality();
        while (this.match('KEYWORD', 'and') || this.match('KEYWORD', 'or')) {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expression = { type: 'logical', operator, left: expression, right };
        }
        return expression;
    }
    parseEquality() {
        let expression = this.parseComparison();
        while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
            const operator = this.previous().value;
            const right = this.parseComparison();
            expression = { type: 'binary', operator, left: expression, right };
        }
        return expression;
    }
    parseComparison() {
        let expression = this.parseTerm();
        while (this.match('OPERATOR', '>') ||
            this.match('OPERATOR', '>=') ||
            this.match('OPERATOR', '<') ||
            this.match('OPERATOR', '<=')) {
            const operator = this.previous().value;
            const right = this.parseTerm();
            expression = { type: 'binary', operator, left: expression, right };
        }
        return expression;
    }
    parseTerm() {
        let expression = this.parseFactor();
        while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
            const operator = this.previous().value;
            const right = this.parseFactor();
            expression = { type: 'binary', operator, left: expression, right };
        }
        return expression;
    }
    parseFactor() {
        let expression = this.parseUnary();
        while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expression = { type: 'binary', operator, left: expression, right };
        }
        return expression;
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
    parsePrimary() {
        if (this.match('NUMBER')) {
            return { type: 'literal', valueType: 'number', value: parseFloat(this.previous().value) };
        }
        if (this.match('STRING')) {
            return { type: 'literal', valueType: 'string', value: this.previous().value.slice(1, -1) };
        }
        if (this.match('KEYWORD', 'true')) {
            return { type: 'literal', valueType: 'boolean', value: true };
        }
        if (this.match('KEYWORD', 'false')) {
            return { type: 'literal', valueType: 'boolean', value: false };
        }
        if (this.match('KEYWORD', 'null')) {
            return { type: 'literal', valueType: 'null', value: null };
        }
        if (this.match('ARRAY_START')) {
            return this.parseArray();
        }
        if (this.match('BLOCK_START')) {
            return this.parseObject();
        }
        if (this.match('IDENT')) {
            const name = this.previous().value;
            if (this.match('OPERATOR', '(')) {
                return this.parseCall(name);
            }
            if (this.match('OPERATOR', '[')) {
                return this.parseIndex(name);
            }
            if (this.match('OPERATOR', '?.')) {
                return this.parseOptionalChain(name);
            }
            return { type: 'variable', name };
        }
        if (this.match('OPERATOR', '(')) {
            const expression = this.parseExpression();
            this.expect('OPERATOR', ')', 'Expected )');
            return expression;
        }
        throw this.error(this.peek(), 'Expected expression');
    }
    parseArray() {
        const elements = [];
        if (!this.check('ARRAY_END')) {
            do {
                elements.push(this.parseExpression());
                if (!this.check('ARRAY_END')) {
                    this.expect('OPERATOR', ',', 'Expected , or ]');
                }
            } while (this.match('OPERATOR', ','));
        }
        this.expect('ARRAY_END', 'Expected ]');
        return { type: 'array', elements };
    }
    parseObject() {
        const properties = [];
        if (!this.check('BLOCK_END')) {
            do {
                const key = this.expectIdentifier('Expected property name').value;
                this.expect('OPERATOR', ':', 'Expected :');
                const value = this.parseExpression();
                properties.push({ key, value });
                if (!this.check('BLOCK_END')) {
                    this.expect('OPERATOR', ',', 'Expected , or }');
                }
            } while (this.match('OPERATOR', ','));
        }
        this.expect('BLOCK_END', 'Expected }');
        return { type: 'object', properties };
    }
    parseCall(name) {
        const args = [];
        if (!this.check('OPERATOR', ')')) {
            do {
                args.push(this.parseExpression());
            } while (this.match('OPERATOR', ','));
        }
        this.expect('OPERATOR', ')', 'Expected )');
        return { type: 'call', name, args };
    }
    parseIndex(name) {
        const index = this.parseExpression();
        this.expect('OPERATOR', ']', 'Expected ]');
        return { type: 'index', object: { type: 'variable', name }, index };
    }
    parseOptionalChain(name) {
        const property = this.expectIdentifier('Expected property name').value;
        return { type: 'optional-chain', object: { type: 'variable', name }, property };
    }
    match(type, ...values) {
        if (this.check(type)) {
            if (values.length === 0 || values.includes(this.peek().value)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(type, value) {
        if (this.isAtEnd())
            return false;
        const token = this.peek();
        if (token.type !== type)
            return false;
        if (value !== undefined)
            return token.value === value;
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
        return this.current >= this.tokens.length;
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
        if (!this.isAtEnd() &&
            this.peek().type !== 'NEWLINE' &&
            this.peek().type !== 'BLOCK_END' &&
            this.peek().type !== 'EOF') {
            throw this.error(this.peek(), 'Expected newline');
        }
        while (!this.isAtEnd() && this.peek().type === 'NEWLINE')
            this.advance();
    }
    checkNewline() {
        return !this.isAtEnd() && this.peek().type === 'NEWLINE';
    }
    error(token, message) {
        throw new SyntaxError(`[line ${token.line}] ${message}`);
    }
}
exports.Parser = Parser;
function parse(tokens, filePath) {
    const parser = new Parser(tokens, filePath);
    const statements = [];
    while (!parser.isAtEnd()) {
        statements.push(parser.parseStatement());
    }
    return statements;
}
