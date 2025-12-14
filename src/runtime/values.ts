export enum ValueType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  FUNCTION = 'function',
  NULL = 'null',
}

export type RuntimeFn = (args: Value[]) => Value;

export class Value {
  constructor(
    public type: ValueType,
    public value: any
  ) {}

  static number(value: number): Value {
    return new Value(ValueType.NUMBER, value);
  }

  static string(value: string): Value {
    return new Value(ValueType.STRING, value);
  }

  static boolean(value: boolean): Value {
    return new Value(ValueType.BOOLEAN, value);
  }

  static array(value: Value[]): Value {
    return new Value(ValueType.ARRAY, value);
  }

  static object(value: Record<string, Value>): Value {
    return new Value(ValueType.OBJECT, value);
  }

  static function(value: RuntimeFn): Value {
    return new Value(ValueType.FUNCTION, value);
  }

  static null(): Value {
    return new Value(ValueType.NULL, null);
  }

  toString(): string {
    switch (this.type) {
      case ValueType.NUMBER:
        return this.value.toString();
      case ValueType.STRING:
        return this.value;
      case ValueType.BOOLEAN:
        return this.value ? 'true' : 'false';
      case ValueType.ARRAY:
        return `[${this.value.map((v: any) => (v as Value).toString()).join(', ')}]`;
      case ValueType.OBJECT:
        const entries = Object.entries(this.value).map(([k, v]) => `${k}: ${(v as Value).toString()}`);
        return `{${entries.join(', ')}}`;
      case ValueType.FUNCTION:
        return '<function>';
      case ValueType.NULL:
        return 'null';
      default:
        return 'unknown';
    }
  }

  isTruthy(): boolean {
    switch (this.type) {
      case ValueType.BOOLEAN:
        return this.value;
      case ValueType.NULL:
        return false;
      case ValueType.NUMBER:
        return this.value !== 0;
      case ValueType.STRING:
        return this.value.length > 0;
      case ValueType.ARRAY:
        return this.value.length > 0;
      case ValueType.OBJECT:
        return Object.keys(this.value).length > 0;
      case ValueType.FUNCTION:
        return true;
      default:
        return false;
    }
  }
}