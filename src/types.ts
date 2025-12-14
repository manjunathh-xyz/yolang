export type TokenType =
  | "NUMBER"
  | "STRING"
  | "IDENT"
  | "KEYWORD"
  | "OPERATOR"
  | "BLOCK_START"
  | "BLOCK_END"
  | "NEWLINE"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface Expression {
  type: 'literal' | 'variable' | 'binary' | 'call';
}

export interface LiteralExpression extends Expression {
  type: 'literal';
  valueType: 'number' | 'string';
  value: number | string;
}

export interface VariableExpression extends Expression {
  type: 'variable';
  name: string;
}

export interface BinaryExpression extends Expression {
  type: 'binary';
  left: Expression;
  operator: string;
  right: Expression;
}

export interface CallExpression extends Expression {
  type: 'call';
  name: string;
  args: Expression[];
}

export interface Statement {
  type: 'say' | 'set' | 'check' | 'loop' | 'function' | 'return';
}

export interface SayStatement extends Statement {
  type: 'say';
  expression: Expression;
}

export interface SetStatement extends Statement {
  type: 'set';
  name: string;
  expression: Expression;
}

export interface CheckStatement extends Statement {
  type: 'check';
  condition: Expression;
  body: Statement[];
  elseBody?: Statement[];
}

export interface LoopStatement extends Statement {
  type: 'loop';
  condition: Expression;
  body: Statement[];
}

export interface FunctionDeclaration extends Statement {
  type: 'function';
  name: string;
  params: string[];
  body: Statement[];
}

export interface ReturnStatement extends Statement {
  type: 'return';
  expression?: Expression;
}

export type Program = Statement[];