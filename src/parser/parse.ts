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
  UseStatement,
  FunctionDeclaration,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  TryStatement,
  SwitchStatement,
  ImportStatement,
  ExportStatement,
  Expression,
  LiteralExpression,
  VariableExpression,
  BinaryExpression,
  LogicalExpression,
  CallExpression,
  ArrayExpression,
  ObjectExpression,
  IndexExpression,
  NilSafeExpression,
  RangeExpression,
  TernaryExpression,
  NilCoalescingExpression,
  OptionalChainExpression,
  AwaitExpression,
} from '../types';
import { SyntaxError } from '../errors/SyntaxError';

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
      if (this.peek().type === 'NEWLINE') {
        this.advance();
        continue;
      }
      statements.push(this.parseStatement());
    }
    return statements;
  }

  private parseStatement(): Statement {
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

  private parseSay(): SayStatement {
    this.advance(); // consume 'say'
    const expr = this.parseExpression();
    this.expectNewline();
    return { type: 'say', expression: expr };
  }

  private parseSet(): SetStatement {
    this.advance(); // 'set'
    const name = this.consume('IDENT', 'Expected variable name').value;
    const opToken = this.consume('OPERATOR', 'Expected =');
    if (opToken.value !== '=') {
      throw new SyntaxError(
        'Expected =',
        this.filePath,
        opToken.line,
        opToken.column,
        'Use "=" for assignment, not "=="'
      );
    }
    const expr = this.parseExpression();
    this.expectNewline();
    return { type: 'set', name, expression: expr };
  }

  private parseCheck(): CheckStatement {
    this.advance(); // 'check'
    const condition = this.parseExpression();
    this.consume('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    let elseBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'else')) {
      this.consume('BLOCK_START', 'Expected { after else');
      elseBody = this.parseBlock();
    }
    return { type: 'check', condition, body, elseBody };
  }

  private parseLoop(): LoopStatement {
    this.advance(); // 'loop'
    const condition = this.parseExpression();
    this.consume('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    return { type: 'loop', condition, body };
  }

  private parseFunction(): FunctionDeclaration {
    this.advance(); // 'fn'
    const name = this.consume('IDENT', 'Expected function name').value;
    this.consume('OPERATOR', 'Expected (', '(');
    const params: { name: string; defaultValue?: Expression }[] = [];
    let restParam: string | undefined;
    if (!this.check('OPERATOR', ')')) {
      do {
        const paramName = this.consume('IDENT', 'Expected parameter name').value;
        let defaultValue: Expression | undefined;
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

  private parseReturn(): ReturnStatement {
    this.advance(); // 'return'
    let expression: Expression | undefined;
    if (!this.check('NEWLINE') && !this.isAtEnd()) {
      expression = this.parseExpression();
    }
    this.expectNewline();
    return { type: 'return', expression };
  }

  private parseFor(): ForStatement {
    this.advance(); // 'for'
    const variable = this.consume('IDENT', 'Expected variable name').value;
    this.consume('KEYWORD', 'Expected in', 'in');
    const range = this.parseExpression();
    this.consume('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    return { type: 'for', variable, range, body };
  }

  private parseBreak(): BreakStatement {
    this.advance(); // 'break'
    this.expectNewline();
    return { type: 'break' };
  }

  private parseContinue(): ContinueStatement {
    this.advance(); // 'continue'
    this.expectNewline();
    return { type: 'continue' };
  }

  private parseConst(): ConstStatement {
    this.advance(); // 'const'
    const name = this.consume('IDENT', 'Expected variable name').value;
    this.consume('OPERATOR', 'Expected =', '=');
    const expression = this.parseExpression();
    this.expectNewline();
    return { type: 'const', name, expression };
  }

  private parseTry(): TryStatement {
    this.advance(); // 'try'
    this.consume('BLOCK_START', 'Expected { after try');
    const tryBody = this.parseBlock();
    let catchParam: string | undefined;
    let catchBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'catch')) {
      this.consume('OPERATOR', 'Expected ( after catch', '(');
      catchParam = this.consume('IDENT', 'Expected catch parameter').value;
      this.consume('OPERATOR', 'Expected )', ')');
      this.consume('BLOCK_START', 'Expected { after catch');
      catchBody = this.parseBlock();
    }
    let finallyBody: Statement[] | undefined;
    if (this.match('KEYWORD', 'finally')) {
      this.consume('BLOCK_START', 'Expected { after finally');
      finallyBody = this.parseBlock();
    }
    return { type: 'try', tryBody, catchParam, catchBody, finallyBody };
  }

  private parseSwitch(): SwitchStatement {
    this.advance(); // 'switch'
    const expression = this.parseExpression();
    this.consume('BLOCK_START', 'Expected { after switch');
    const cases: { value: Expression; body: Statement[] }[] = [];
    let defaultCase: Statement[] | undefined;
    while (!this.check('BLOCK_END') && !this.isAtEnd()) {
      if (this.match('KEYWORD', 'case')) {
        const value = this.parseExpression();
        this.consume('BLOCK_START', 'Expected { after case value');
        const body = this.parseBlock();
        cases.push({ value, body });
      } else if (this.match('KEYWORD', 'default')) {
        this.consume('BLOCK_START', 'Expected { after default');
        defaultCase = this.parseBlock();
      } else {
        throw this.error(this.peek(), 'Expected case or default in switch');
      }
    }
    this.consume('BLOCK_END', 'Expected } after switch');
    return { type: 'switch', expression, cases, defaultCase };
  }

  private parseImport(): ImportStatement {
    this.advance(); // 'import'
    this.consume('OPERATOR', 'Expected { after import', '{');
    const names: string[] = [];
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

  private parseExport(): ExportStatement {
    this.advance(); // 'export'
    const name = this.expectIdentifier('Expected identifier after export').value;
    let expression: Expression | undefined;
    if (this.peek().type !== 'NEWLINE') {
      expression = this.parseExpression();
    }
    this.expectNewline();
    return { type: 'export', name, expression };
  }

  private parseUse(): UseStatement {
    this.advance(); // 'use'
    const module = this.expectIdentifier('Expected module name after use').value;
    this.expect('BLOCK_START', 'Expected { after module name');
    const imports: string[] = [];
    while (!this.check('BLOCK_END')) {
      const ident = this.expectIdentifier('Expected identifier in import list');
      imports.push(ident.value);
      if (!this.check('BLOCK_END')) {
        this.expect('OPERATOR', ',', 'Expected , or }');
      }
    }
    this.advance(); // consume }
    this.expectNewline();
    return { type: 'use', module, imports };
  }

  private parseBlock(): Statement[] {
    const statements: Statement[] = [];
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

  private parseExpression(): Expression {
    return this.parseTernary();
  }

  private parseTernary(): Expression {
    const expr = this.parseNilCoalescing();
    if (this.match('OPERATOR', '?')) {
      const thenBranch = this.parseExpression();
      this.consume('OPERATOR', 'Expected : in ternary', ':');
      const elseBranch = this.parseTernary(); // right associative
      return { type: 'ternary', condition: expr, thenBranch, elseBranch } as TernaryExpression;
    }
    return expr;
  }

  private parseNilCoalescing(): Expression {
    const expr = this.parseLogical();
    if (this.match('OPERATOR', '??')) {
      const right = this.parseNilCoalescing();
      return { type: 'nil-coalescing', left: expr, right } as NilCoalescingExpression;
    }
    return expr;
  }

  private parseLogical(): Expression {
    let expr = this.parseEquality();
    while (this.match('KEYWORD', 'and', 'or')) {
      const operator = this.previous().value as 'and' | 'or';
      const right = this.parseEquality();
      expr = { type: 'logical', left: expr, operator, right } as LogicalExpression;
    }
    return expr;
  }

  private parseEquality(): Expression {
    let expr = this.parseComparison();
    while (this.match('OPERATOR', '==', '!=')) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = { type: 'binary', left: expr, operator, right } as BinaryExpression;
    }
    return expr;
  }

  private parseComparison(): Expression {
    let expr = this.parseTerm();
    while (this.match('OPERATOR', '>', '<', '>=', '<=')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = { type: 'binary', left: expr, operator, right } as BinaryExpression;
    }
    return expr;
  }

  private parseTerm(): Expression {
    let expr = this.parseRange();
    while (this.match('OPERATOR', '+', '-')) {
      const operator = this.previous().value;
      const right = this.parseRange();
      expr = { type: 'binary', left: expr, operator, right } as BinaryExpression;
    }
    return expr;
  }

  private parseRange(): Expression {
    let expr = this.parseFactor();
    if (this.match('OPERATOR', '..')) {
      const start = expr;
      const end = this.parseFactor();
      expr = { type: 'range', start, end } as RangeExpression;
    }
    return expr;
  }

  private parseFactor(): Expression {
    let expr = this.parseUnary();
    while (this.match('OPERATOR', '*', '/')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = { type: 'binary', left: expr, operator, right } as BinaryExpression;
    }
    return expr;
  }

  private parseUnary(): Expression {
    if (this.match('KEYWORD', 'not')) {
      const operator = 'not';
      const right = this.parseUnary();
      return { type: 'logical', operator, right } as LogicalExpression;
    }
    if (this.match('KEYWORD', 'await')) {
      const expression = this.parseUnary();
      return { type: 'await', expression } as AwaitExpression;
    }
    return this.parsePrimary();
  }

  // TODO: v0.5.0 - Add parsing for arrays [], objects {}, and indexing []
  private parsePrimary(): Expression {
    if (this.match('NUMBER')) {
      return {
        type: 'literal',
        valueType: 'number',
        value: parseFloat(this.previous().value),
      } as LiteralExpression;
    }
    if (this.match('STRING')) {
      return {
        type: 'literal',
        valueType: 'string',
        value: this.previous().value,
      } as LiteralExpression;
    }
    if (this.match('KEYWORD', 'true')) {
      return { type: 'literal', valueType: 'boolean', value: true } as LiteralExpression;
    }
    if (this.match('KEYWORD', 'false')) {
      return { type: 'literal', valueType: 'boolean', value: false } as LiteralExpression;
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

  private parseArray(): ArrayExpression {
    const elements: Expression[] = [];
    if (!this.check('OPERATOR', ']')) {
      do {
        elements.push(this.parseExpression());
      } while (this.match('OPERATOR', ','));
    }
    this.consume('OPERATOR', 'Expected ]', ']');
    return { type: 'array', elements } as ArrayExpression;
  }

  private parseObject(): ObjectExpression {
    const properties: { key: string; value: Expression }[] = [];
    if (!this.check('OPERATOR', '}')) {
      do {
        const key = this.consume('IDENT', 'Expected property name').value;
        this.consume('OPERATOR', 'Expected :', ':');
        const value = this.parseExpression();
        properties.push({ key, value });
      } while (this.match('OPERATOR', ','));
    }
    this.consume('OPERATOR', 'Expected }', '}');
    return { type: 'object', properties } as ObjectExpression;
  }

  private parseIdentifierOrCall(): Expression {
    const name = this.previous().value;
    let expr: Expression = { type: 'variable', name } as VariableExpression;

    // Handle indexing
    while (this.match('OPERATOR', '[')) {
      const index = this.parseExpression();
      this.consume('OPERATOR', 'Expected ]', ']');
      expr = { type: 'index', object: expr, index } as IndexExpression;
    }

    // Handle optional chaining
    if (this.match('OPERATOR', '?')) {
      this.consume('OPERATOR', 'Expected . after ?', '.');
      const property = this.consume('IDENT', 'Expected property name').value;
      expr = { type: 'optional-chain', object: expr, property } as OptionalChainExpression;
    }

    // Handle function calls
    if (this.match('OPERATOR', '(')) {
      const args: Expression[] = [];
      if (!this.check('OPERATOR', ')')) {
        do {
          args.push(this.parseExpression());
        } while (this.match('OPERATOR', ','));
      }
      this.consume('OPERATOR', 'Expected )', ')');
      expr = { type: 'call', name, args } as CallExpression;
    }

    return expr;
  }

  private match(type: TokenType, ...values: string[]): boolean {
    if (this.check(type, ...values)) {
      this.advance();
      return true;
    }
    return false;
  }

  private check(type: TokenType, ...values: string[]): boolean {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (token.type !== type) return false;
    if (values.length > 0 && !values.includes(token.value)) return false;
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

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private consume(type: TokenType, message: string, ...values: string[]): Token {
    if (this.check(type, ...values)) return this.advance();
    throw this.error(this.peek(), message);
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

  private expectIdentifier(message: string): Token {
    if (this.peek().type === 'IDENT') return this.advance();
    throw this.error(this.peek(), message);
  }

  private expectNewline() {
    if (!this.isAtEnd() && this.peek().type !== 'NEWLINE' && this.peek().type !== 'BLOCK_END') {
      throw this.error(this.peek(), 'Expected newline');
    }
    if (!this.isAtEnd() && this.peek().type === 'NEWLINE') this.advance();
  }

  private error(token: Token, message: string): never {
    throw new SyntaxError(message, this.filePath, token.line, token.column);
  }
}

export function parse(tokens: Token[], filePath?: string): Program {
  const parser = new Parser(tokens, filePath);
  return parser.parse();
}
