"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.Parser = void 0;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
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
                case 'check':
                    return this.parseCheck();
                case 'loop':
                    return this.parseLoop();
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
        this.consume('OPERATOR', 'Expected =').value === '=' || this.error(this.peek(), 'Expected =');
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
        return this.parseEquality();
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
        let expr = this.parseFactor();
        while (this.match('OPERATOR', '+', '-')) {
            const operator = this.previous().value;
            const right = this.parseFactor();
            expr = { type: 'binary', left: expr, operator, right };
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
        // No unary operators yet
        return this.parsePrimary();
    }
    parsePrimary() {
        if (this.match('NUMBER')) {
            return { type: 'literal', valueType: 'number', value: parseFloat(this.previous().value) };
        }
        if (this.match('STRING')) {
            return { type: 'literal', valueType: 'string', value: this.previous().value };
        }
        if (this.match('IDENT')) {
            return { type: 'variable', name: this.previous().value };
        }
        if (this.match('OPERATOR', '(')) {
            const expr = this.parseExpression();
            this.consume('OPERATOR', 'Expected )', ')');
            return expr;
        }
        throw this.error(this.peek(), 'Expected expression');
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
    expectNewline() {
        if (!this.isAtEnd() && this.peek().type !== 'NEWLINE' && this.peek().type !== 'BLOCK_END') {
            throw this.error(this.peek(), 'Expected newline');
        }
        if (!this.isAtEnd() && this.peek().type === 'NEWLINE')
            this.advance();
    }
    error(token, message) {
        return new Error(`${message} at line ${token.line}, column ${token.column}`);
    }
}
exports.Parser = Parser;
function parse(tokens) {
    const parser = new Parser(tokens);
    return parser.parse();
}
exports.parse = parse;
