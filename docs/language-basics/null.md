# Null

Null in Kexra represents the absence of a value.

## Why this exists

Null allows programs to indicate missing or undefined data.

## How it works

The `null` literal represents no value. Use nil-safe operators to handle null safely.

## Examples

```kx
set value = null
say value ?? "default"  # nil-safe
```

## Common mistakes

- Accessing properties on null values without checking
- Confusing null with empty strings or zero

## Related topics

- [Nil-Safe Operators](nil-safe-operators.md)
- [Expressions](expressions.md)
