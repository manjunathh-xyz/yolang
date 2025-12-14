import { Token, TokenType, Program, Statement, SayStatement, SetStatement, CheckStatement, LoopStatement, FunctionDeclaration, ReturnStatement, Expression, LiteralExpression, VariableExpression, BinaryExpression, CallExpression } from '../types';
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
        case 'check':
          return this.parseCheck();
        case 'loop':
          return this.parseLoop();
        case 'fn':
          return this.parseFunction();
        case 'return':
          return this.parseReturn();
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
       throw new SyntaxError('Expected =', this.filePath, opToken.line, opToken.column, 'Use "=" for assignment, not "=="');
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
    const params: string[] = [];
    if (!this.check('OPERATOR', ')')) {
      do {
        params.push(this.consume('IDENT', 'Expected parameter name').value);
      } while (this.match('OPERATOR', ','));
    }
    this.consume('OPERATOR', 'Expected )', ')');
    this.consume('BLOCK_START', 'Expected {');
    const body = this.parseBlock();
    return { type: 'function', name, params, body };
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
    return this.parseEquality();
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
    let expr = this.parseFactor();
    while (this.match('OPERATOR', '+', '-')) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = { type: 'binary', left: expr, operator, right } as BinaryExpression;
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
    // No unary operators yet
    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    if (this.match('NUMBER')) {
      return { type: 'literal', valueType: 'number', value: parseFloat(this.previous().value) } as LiteralExpression;
    }
    if (this.match('STRING')) {
      return { type: 'literal', valueType: 'string', value: this.previous().value } as LiteralExpression;
    }
    if (this.match('IDENT')) {
      const name = this.previous().value;
      if (this.match('OPERATOR', '(')) {
        const args: Expression[] = [];
        if (!this.check('OPERATOR', ')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match('OPERATOR', ','));
        }
        this.consume('OPERATOR', 'Expected )', ')');
        return { type: 'call', name, args } as CallExpression;
      } else {
        return { type: 'variable', name } as VariableExpression;
      }
    }
    if (this.match('OPERATOR', '(')) {
      const expr = this.parseExpression();
      this.consume('OPERATOR', 'Expected )', ')');
      return expr;
    }
    throw this.error(this.peek(), 'Expected expression');
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