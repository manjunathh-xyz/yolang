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
      const keys = Object.keys(arg.value).map((k) => Value.string(k));
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

  // Array helpers
  map: (args: Value[]): Value => {
    if (args.length !== 2) {
      throw new Error('map expects exactly 2 arguments');
    }
    const arr = args[0];
    const fn = args[1];
    if (arr.type !== ValueType.ARRAY || fn.type !== ValueType.FUNCTION) {
      throw new Error('map expects array and function');
    }
    const result = arr.value.map((item: Value) => {
      // Call fn with item
      return fn.value([item]);
    });
    return Value.array(result);
  },

  filter: (args: Value[]): Value => {
    if (args.length !== 2) {
      throw new Error('filter expects exactly 2 arguments');
    }
    const arr = args[0];
    const fn = args[1];
    if (arr.type !== ValueType.ARRAY || fn.type !== ValueType.FUNCTION) {
      throw new Error('filter expects array and function');
    }
    const result = arr.value.filter((item: Value) => {
      const res = fn.value([item]);
      return res.isTruthy();
    });
    return Value.array(result);
  },

  // String helpers
  trim: (args: Value[]): Value => {
    if (args.length !== 1 || args[0].type !== ValueType.STRING) {
      throw new Error('trim expects one string');
    }
    return Value.string(args[0].value.trim());
  },

  split: (args: Value[]): Value => {
    if (
      args.length !== 2 ||
      args[0].type !== ValueType.STRING ||
      args[1].type !== ValueType.STRING
    ) {
      throw new Error('split expects string and delimiter');
    }
    // @ts-ignore
    const parts = args[0].value.split(args[1].value).map((s) => Value.string(s));
    return Value.array(parts);
  },

  lower: (args: Value[]): Value => {
    if (args.length !== 1 || args[0].type !== ValueType.STRING) {
      throw new Error('lower expects one string');
    }
    return Value.string(args[0].value.toLowerCase());
  },

  upper: (args: Value[]): Value => {
    if (args.length !== 1 || args[0].type !== ValueType.STRING) {
      throw new Error('upper expects one string');
    }
    return Value.string(args[0].value.toUpperCase());
  },

  // Type helpers
  isNumber: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('isNumber expects one argument');
    }
    return Value.boolean(args[0].type === ValueType.NUMBER);
  },

  isString: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('isString expects one argument');
    }
    return Value.boolean(args[0].type === ValueType.STRING);
  },

  isArray: (args: Value[]): Value => {
    if (args.length !== 1) {
      throw new Error('isArray expects one argument');
    }
    return Value.boolean(args[0].type === ValueType.ARRAY);
  },

  // Time helpers
  now: (args: Value[]): Value => {
    if (args.length !== 0) {
      throw new Error('now expects no arguments');
    }
    return Value.number(Date.now());
  },

  sleep: (args: Value[]): Value => {
    if (args.length !== 1 || args[0].type !== ValueType.NUMBER) {
      throw new Error('sleep expects one number (milliseconds)');
    }
    // For async, but since not implemented, just return
    return Value.null();
  },
};
