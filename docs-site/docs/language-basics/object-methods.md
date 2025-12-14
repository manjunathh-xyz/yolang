# Object Methods

Objects provide methods for property manipulation.

## Why this exists

Object methods enable working with structured data.

## How it works

Built-in functions like `keys`, `values` work on objects.

## Examples

```kx
set obj = { a: 1, b: 2 }
say keys(obj)  # ["a", "b"]
say values(obj)  # [1, 2]
```

## Common mistakes

- Accessing non-existent properties
- Confusing object and array methods

## Related topics

- [Objects](objects.md)
- [Standard Library](standard-library.md)
