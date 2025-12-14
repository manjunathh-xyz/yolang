export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'IDENT'
  | 'KEYWORD'
  | 'OPERATOR'
  | 'BLOCK_START'
  | 'BLOCK_END'
  | 'ARRAY_START'
  | 'ARRAY_END'
  | 'NEWLINE'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export type Expression =
  | LiteralExpression
  | VariableExpression
  | BinaryExpression
  | LogicalExpression
  | CallExpression
  | ArrayExpression
  | ObjectExpression
  | IndexExpression
  | NilSafeExpression
  | RangeExpression
  | TernaryExpression
  | NilCoalescingExpression
  | OptionalChainExpression
  | AwaitExpression
  | UnaryExpression;

export interface LiteralExpression {
  type: 'literal';
  valueType: 'number' | 'string' | 'boolean' | 'null';
  value: number | string | boolean | null;
}

// TODO: v0.5.0 - Implement unified Value type for runtime
export type Value =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'array'; value: Value[] }
  | { type: 'object'; value: Map<string, Value> }
  | { type: 'function'; value: FunctionDeclaration }
  | { type: 'null'; value: null };

export interface VariableExpression {
  type: 'variable';
  name: string;
}

export interface BinaryExpression {
  type: 'binary';
  left: Expression;
  operator: string;
  right: Expression;
}

export interface CallExpression {
  type: 'call';
  name: string;
  args: Expression[];
}

export interface ArrayExpression {
  type: 'array';
  elements: Expression[];
}

export interface ObjectExpression {
  type: 'object';
  properties: { key: string; value: Expression }[];
}

export interface IndexExpression {
  type: 'index';
  object: Expression;
  index: Expression;
}

export interface LogicalExpression {
  type: 'logical';
  operator: string;
  left?: Expression;
  right: Expression;
}

export interface NilSafeExpression {
  type: 'nil-safe';
  object: Expression;
  property: string;
}

export interface RangeExpression {
  type: 'range';
  start: Expression;
  end: Expression;
}

export interface TernaryExpression {
  type: 'ternary';
  condition: Expression;
  thenBranch: Expression;
  elseBranch: Expression;
}

export interface NilCoalescingExpression {
  type: 'nil-coalescing';
  left: Expression;
  right: Expression;
}

export interface OptionalChainExpression {
  type: 'optional-chain';
  object: Expression;
  property: string;
}

export interface AwaitExpression {
  type: 'await';
  expression: Expression;
}

export interface UnaryExpression {
  type: 'unary';
  operator: string;
  right: Expression;
}

export type Statement =
  | SayStatement
  | SetStatement
  | ConstStatement
  | CheckStatement
  | LoopStatement
  | ForStatement
  | FunctionDeclaration
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | TryStatement
  | SwitchStatement
  | ImportStatement
  | ExportStatement
  | UseStatement;

export interface SayStatement {
  type: 'say';
  expression: Expression;
}

export interface SetStatement {
  type: 'set';
  name: string;
  expression: Expression;
}

export interface CheckStatement {
  type: 'check';
  condition: Expression;
  body: Statement[];
  elseBody?: Statement[];
}

export interface LoopStatement {
  type: 'loop';
  condition: Expression;
  body: Statement[];
}

export interface FunctionDeclaration {
  type: 'function';
  name: string;
  params: Parameter[];
  restParam?: string;
  body: Statement[];
}

export interface ReturnStatement {
  type: 'return';
  expression?: Expression;
}

export interface ForStatement {
  type: 'for';
  variable: string;
  iterable: Expression;
  body: Statement[];
}

export interface BreakStatement {
  type: 'break';
}

export interface ContinueStatement {
  type: 'continue';
}

export interface ConstStatement {
  type: 'const';
  name: string;
  expression: Expression;
}

export interface TryStatement {
  type: 'try';
  tryBody: Statement[];
  catchParam?: string;
  catchBody?: Statement[];
  finallyBody?: Statement[];
}

export interface SwitchStatement {
  type: 'switch';
  expression: Expression;
  cases: { value: Expression; body: Statement[] }[];
  defaultBody?: Statement[];
}

export interface ImportStatement {
  type: 'import';
  name: string;
}

export interface ExportStatement {
  type: 'export';
  name: string;
  expression?: Expression;
}

export interface UseStatement {
  type: 'use';
  module: string;
  imports: string[];
}

export interface Parameter {
  name: string;
  defaultValue?: Expression;
}

export type Program = Statement[];
