import { Value, ValueType, RuntimeFn } from './values';

export const builtins: Record<string, RuntimeFn> = {
  len: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('len expects exactly 1 argument');
    }
    const arg = args[0];
    if (arg.type === ValueType.STRING) {
      return Value.number(arg.value.length);
    } else if (arg.type === ValueType.ARRAY) {
      return Value.number(arg.value.length);
    } else {
      throw new Error('len expects a string or array');
    }
  },

  type: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('type expects exactly 1 argument');
    }
    return Value.string(args[0].type);
  },

  print: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('print expects exactly 1 argument');
    }
    console.log(args[0].toString());
    return Value.null();
  },

  say: (args: Value[]): Value => {
    // Alias for print
    return builtins.print(args);
  },

  keys: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('keys expects exactly 1 argument');
    }
    const arg = args[0];
    if (arg.type === ValueType.OBJECT) {
      const keys = Object.keys(arg.value).map(k => Value.string(k));
      return Value.array(keys);
    } else {
      throw new Error('keys expects an object');
    }
  },

  values: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('values expects exactly 1 argument');
    }
    const arg = args[0];
    if (arg.type === ValueType.OBJECT) {
      const vals = Object.values(arg.value) as Value[];
      return Value.array(vals);
    } else {
      throw new Error('values expects an object');
    }
  },
};