# Objects

Objects in Kexra store key-value pairs for structured data.

## Why this exists

Objects enable complex data structures with named properties.

## How it works

Objects use `{}` syntax with key-value pairs. Access properties with dot notation or brackets.

## Examples

```kx
set person = { name: "Alice", age: 30 }
say person.name  # Alice
```

## Common mistakes

- Using invalid keys (must be identifiers or strings)
- Confusing object and array access

## Related topics

- [Arrays](arrays.md)
- [Object Methods](object-methods.md)
