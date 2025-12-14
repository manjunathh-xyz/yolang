# Type Helpers

Built-in functions for checking value types.

## Why this exists

Dynamic typing requires runtime type checking for robust programs.

## How it works

Type helpers return boolean values indicating whether a value matches a specific type.

## Examples

```kx
fn processValue(value) {
  check isNumber(value) {
    return value * 2
  } else check isString(value) {
    return upper(value)
  } else check isArray(value) {
    return len(value)
  } else {
    throw "Unsupported type"
  }
}

# Also available: type() function
set typeName = type(42)  # "number"
```

## Common mistakes

- Using type() for comparisons instead of type helpers
- Not handling all possible types in functions

## Related topics

- [Data Types](../language-basics/data-types.md)
- [Typeof Operator](../language-basics/expressions.md)
- [Conditional Statements](../control-flow/conditional-statements.md)
