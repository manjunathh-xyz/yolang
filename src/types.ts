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

export interface Expression {
  type:
    | 'literal'
    | 'variable'
    | 'binary'
    | 'logical'
    | 'call'
    | 'array'
    | 'object'
    | 'index'
    | 'nil-safe'
    | 'range'
    | 'ternary'
    | 'nil-coalescing'
    | 'optional-chain'
    | 'await'
    | 'unary';
}

export interface LiteralExpression extends Expression {
  type: 'literal';
  valueType: 'number' | 'string' | 'boolean';
  value: number | string | boolean;
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

export interface ArrayExpression extends Expression {
  type: 'array';
  elements: Expression[];
}

export interface ObjectExpression extends Expression {
  type: 'object';
  properties: { key: string; value: Expression }[];
}

export interface IndexExpression extends Expression {
  type: 'index';
  object: Expression;
  index: Expression;
}

export interface LogicalExpression extends Expression {
  type: 'logical';
  left: Expression;
  operator: 'and' | 'or' | 'not';
  right?: Expression; // for not, right is undefined
}

export interface NilSafeExpression extends Expression {
  type: 'nil-safe';
  object: Expression;
  property: string;
}

export interface RangeExpression extends Expression {
  type: 'range';
  start: Expression;
  end: Expression;
}

export interface TernaryExpression extends Expression {
  type: 'ternary';
  condition: Expression;
  thenBranch: Expression;
  elseBranch: Expression;
}

export interface NilCoalescingExpression extends Expression {
  type: 'nil-coalescing';
  left: Expression;
  right: Expression;
}

export interface OptionalChainExpression extends Expression {
  type: 'optional-chain';
  object: Expression;
  property: string;
}

export interface AwaitExpression extends Expression {
  type: 'await';
  expression: Expression;
}

export interface UnaryExpression extends Expression {
  type: 'unary';
  operator: string;
  right: Expression;
}

export interface Statement {
  type:
    | 'say'
    | 'set'
    | 'const'
    | 'check'
    | 'loop'
    | 'for'
    | 'function'
    | 'return'
    | 'break'
    | 'continue'
    | 'try'
    | 'switch'
    | 'import'
    | 'export'
    | 'use';
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
  params: { name: string; defaultValue?: Expression }[];
  restParam?: string;
  body: Statement[];
}

export interface ReturnStatement extends Statement {
  type: 'return';
  expression?: Expression;
}

export interface ForStatement extends Statement {
  type: 'for';
  variable: string;
  range: Expression;
  body: Statement[];
}

export interface BreakStatement extends Statement {
  type: 'break';
}

export interface ContinueStatement extends Statement {
  type: 'continue';
}

export interface ConstStatement extends Statement {
  type: 'const';
  name: string;
  expression: Expression;
}

export interface TryStatement extends Statement {
  type: 'try';
  tryBody: Statement[];
  catchParam?: string;
  catchBody?: Statement[];
  finallyBody?: Statement[];
}

export interface SwitchStatement extends Statement {
  type: 'switch';
  expression: Expression;
  cases: { value: Expression; body: Statement[] }[];
  defaultCase?: Statement[];
}

export interface ImportStatement extends Statement {
  type: 'import';
  names: string[];
  module: string;
}

export interface ExportStatement extends Statement {
  type: 'export';
  name: string;
  expression?: Expression;
}

export interface UseStatement extends Statement {
  type: 'use';
  module: string;
  imports: string[];
}

export type Program = Statement[];
