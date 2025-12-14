# Nil-Safe Operators

Nil-safe operators handle null values safely.

## Why this exists

Nil-safe operators prevent errors when working with potentially null data.

## How it works

The `??` operator provides defaults for null values.

## Examples

```kx
set value = null
say value ?? "default"  # "default"
```

## Common mistakes

- Using `??` instead of `==` for comparison
- Nesting nil-safe operators incorrectly

## Related topics

- [Null](null.md)
- [Expressions](expressions.md)
