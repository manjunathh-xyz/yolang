# Type Helpers

Type helper functions check and work with data types.

## Why this exists

Type helpers enable runtime type checking and safe operations.

## How it works

Functions like `isNumber`, `isString`, `type` provide type information.

## Examples

```kx
set value = 42
check isNumber(value) {
  say "It's a number"
}
say type(value)  # "number"
```

## Common mistakes

- Using wrong case for type names
- Assuming type checks are unnecessary

## Related topics

- [Data Types](data-types.md)
- [Standard Library](standard-library.md)
