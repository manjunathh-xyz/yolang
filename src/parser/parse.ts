import {
  Token,
  TokenType,
  Program,
  Statement,
  SayStatement,
  SetStatement,
  ConstStatement,
  CheckStatement,
  LoopStatement,
  ForStatement,
  FunctionDeclaration,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  TryStatement,
  SwitchStatement,
  ImportStatement,
  ExportStatement,
  UseStatement,
  Expression,
  LiteralExpression,
  VariableExpression,
  BinaryExpression,
  CallExpression,
  ArrayExpression,
  ObjectExpression,
  IndexExpression,
  LogicalExpression,
  NilSafeExpression,
  RangeExpression,
  TernaryExpression,
  NilCoalescingExpression,
  OptionalChainExpression,
  AwaitExpression,
  UnaryExpression,
  Parameter,
} from '../types';

export class Parser {
  private tokens: Token[];
  private current = 0;
  private filePath?: string;

  constructor(tokens: Token[], filePath?: string) {
    this.tokens = tokens;
    this.filePath = filePath;
  }

  parse(): Program {
    const statements: Statement[] = [];
    while (!this.isAtEnd()) {
      statements.push(this.parseStatement());
    }
    return statements;
  }

  public parseStatement(): Statement {
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

  private parseSay(): SayStatement {
    const expression = this.parseExpression();
    this.expectNewline();
    return { type: 'say', expression };
  }

  private parseSet(): SetStatement {
    const name = this.expectIdentifier('Expected variable name').value;
    this.expect('OPERATOR', '=', 'Expected =');
    const expression = this.parseExpression();
    this.expectNewline();
    return { type: 'set', name, expression };
  }

  private parseConst(): ConstStatement {
    const name = this.expectIdentifier('Expected variable name').value;
    this.expect('OPERATOR', '=', 'Expected =');
    const expression = this.parseExpression();
    this.expectNewline();
    return { type: 'const', name, expression };
  }

  private parseCheck(): CheckStatement {
    const condition = this.parseExpression();
    this.expect('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    let elseBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'else')) {
      this.expect('BLOCK_START', 'Expected {');
      elseBody = this.parseBlock();
    }
    return { type: 'check', condition, body, elseBody };
  }

  private parseLoop(): LoopStatement {
    const condition = this.parseExpression();
    this.expect('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    return { type: 'loop', condition, body };
  }

  private parseFor(): ForStatement {
    const variable = this.expectIdentifier('Expected variable name').value;
    this.expect('KEYWORD', 'in', 'Expected in');
    const iterable = this.parseExpression();
    this.expect('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    return { type: 'for', variable, iterable, body };
  }

  private parseFunction(): FunctionDeclaration {
    const name = this.expectIdentifier('Expected function name').value;
    this.expect('OPERATOR', '(', 'Expected (');
    const params: Parameter[] = [];
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

  private parseReturn(): ReturnStatement {
    let expression: Expression | undefined;
    if (!this.checkNewline()) {
      expression = this.parseExpression();
    }
    this.expectNewline();
    return { type: 'return', expression };
  }

  private parseBreak(): BreakStatement {
    this.expectNewline();
    return { type: 'break' };
  }

  private parseContinue(): ContinueStatement {
    this.expectNewline();
    return { type: 'continue' };
  }

  private parseTry(): TryStatement {
    this.expect('BLOCK_START', 'Expected {');
    const tryBody = this.parseBlock();
    this.expect('KEYWORD', 'catch', 'Expected catch');
    const catchParam = this.expectIdentifier('Expected catch parameter').value;
    this.expect('BLOCK_START', 'Expected {');
    const catchBody = this.parseBlock();
    let finallyBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'finally')) {
      this.expect('BLOCK_START', 'Expected {');
      finallyBody = this.parseBlock();
    }
    return { type: 'try', tryBody, catchParam, catchBody, finallyBody };
  }

  private parseSwitch(): SwitchStatement {
    const expression = this.parseExpression();
    this.expect('BLOCK_START', 'Expected {');
    const cases: { value: Expression; body: Statement[] }[] = [];
    while (this.match('KEYWORD', 'case')) {
      const value = this.parseExpression();
      this.expect('OPERATOR', ':', 'Expected :');
      const body = this.parseBlock();
      cases.push({ value, body });
    }
    let defaultBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'default')) {
      this.expect('OPERATOR', ':', 'Expected :');
      defaultBody = this.parseBlock();
    }
    this.expect('BLOCK_END', 'Expected }');
    return { type: 'switch', expression, cases, defaultBody };
  }

  private parseImport(): ImportStatement {
    const name = this.expectIdentifier('Expected module name').value;
    this.expectNewline();
    return { type: 'import', name };
  }

  private parseExport(): ExportStatement {
    const name = this.expectIdentifier('Expected export name').value;
    let expression: Expression | undefined;
    if (!this.checkNewline()) {
      expression = this.parseExpression();
    }
    this.expectNewline();
    return { type: 'export', name, expression };
  }

  private parseUse(): UseStatement {
    const module = this.expectIdentifier('Expected module name').value;
    this.skipNewlines();
    this.expect('BLOCK_START', 'Expected {');
    this.skipNewlines();
    const imports: string[] = [];
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

  private parseBlock(): Statement[] {
    const statements: Statement[] = [];
    while (!this.check('BLOCK_END') && !this.isAtEnd()) {
      statements.push(this.parseStatement());
    }
    this.expect('BLOCK_END', 'Expected }');
    return statements;
  }

  private parseExpression(): Expression {
    return this.parseTernary();
  }

  private parseTernary(): Expression {
    let expression = this.parseLogical();
    if (this.match('OPERATOR', '?')) {
      const thenBranch = this.parseExpression();
      this.expect('OPERATOR', ':', 'Expected :');
      const elseBranch = this.parseTernary();
      expression = { type: 'ternary', condition: expression, thenBranch, elseBranch };
    }
    return expression;
  }

  private parseLogical(): Expression {
    let expression = this.parseEquality();
    while (this.match('KEYWORD', 'and') || this.match('KEYWORD', 'or')) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expression = { type: 'logical', operator, left: expression, right };
    }
    return expression;
  }

  private parseEquality(): Expression {
    let expression = this.parseComparison();
    while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expression = { type: 'binary', operator, left: expression, right };
    }
    return expression;
  }

  private parseComparison(): Expression {
    let expression = this.parseTerm();
    while (
      this.match('OPERATOR', '>') ||
      this.match('OPERATOR', '>=') ||
      this.match('OPERATOR', '<') ||
      this.match('OPERATOR', '<=')
    ) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expression = { type: 'binary', operator, left: expression, right };
    }
    return expression;
  }

  private parseTerm(): Expression {
    let expression = this.parseFactor();
    while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expression = { type: 'binary', operator, left: expression, right };
    }
    return expression;
  }

  private parseFactor(): Expression {
    let expression = this.parseUnary();
    while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expression = { type: 'binary', operator, left: expression, right };
    }
    return expression;
  }

  private parseUnary(): Expression {
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

  private parsePrimary(): Expression {
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

  private parseArray(): ArrayExpression {
    const elements: Expression[] = [];
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

  private parseObject(): ObjectExpression {
    const properties: { key: string; value: Expression }[] = [];
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

  private parseCall(name: string): CallExpression {
    const args: Expression[] = [];
    if (!this.check('OPERATOR', ')')) {
      do {
        args.push(this.parseExpression());
      } while (this.match('OPERATOR', ','));
    }
    this.expect('OPERATOR', ')', 'Expected )');
    return { type: 'call', name, args };
  }

  private parseIndex(name: string): IndexExpression {
    const index = this.parseExpression();
    this.expect('OPERATOR', ']', 'Expected ]');
    return { type: 'index', object: { type: 'variable', name }, index };
  }

  private parseOptionalChain(name: string): OptionalChainExpression {
    const property = this.expectIdentifier('Expected property name').value;
    return { type: 'optional-chain', object: { type: 'variable', name }, property };
  }

  private match(type: TokenType, ...values: string[]): boolean {
    if (this.check(type)) {
      if (values.length === 0 || values.includes(this.peek().value)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean;
  private check(type: TokenType, value: string): boolean;
  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== undefined) return token.value === value;
    return true;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  public isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  private expect(type: TokenType, message: string): Token;
  private expect(type: TokenType, value: string, message: string): Token;
  private expect(type: TokenType, valueOrMessage: string, message?: string): Token {
    if (this.check(type)) {
      const token = this.peek();
      if (message === undefined) {
        // valueOrMessage is message
        return this.advance();
      } else {
        // valueOrMessage is value
        if (token.value === valueOrMessage) return this.advance();
        throw this.error(token, message);
      }
    }
    throw this.error(this.peek(), message || valueOrMessage);
  }

  private skipNewlines(): void {
    while (!this.isAtEnd() && this.peek().type === 'NEWLINE') {
      this.advance();
    }
  }

  private expectIdentifier(message: string): Token {
    if (this.peek().type === 'IDENT') return this.advance();
    throw this.error(this.peek(), message);
  }

  private expectNewline() {
    if (!this.isAtEnd() && this.peek().type !== 'NEWLINE' && this.peek().type !== 'BLOCK_END') {
      throw this.error(this.peek(), 'Expected newline');
    }
    while (!this.isAtEnd() && this.peek().type === 'NEWLINE') this.advance();
  }

  private checkNewline(): boolean {
    return !this.isAtEnd() && this.peek().type === 'NEWLINE';
  }

  private error(token: Token, message: string): never {
    throw new SyntaxError(`[line ${token.line}] ${message}`);
  }
}

export function parse(tokens: Token[], filePath?: string): Program {
  const parser = new Parser(tokens, filePath);
  const statements: Statement[] = [];
  while (!parser.isAtEnd()) {
    statements.push(parser.parseStatement());
  }
  return statements;
}
