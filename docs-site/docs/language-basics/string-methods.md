# String Methods

Strings provide methods for text manipulation.

## Why this exists

String methods enable processing and formatting text data.

## How it works

Built-in functions operate on strings: `len`, `trim`, `split`, `lower`, `upper`.

## Examples

```kx
set text = "  Hello  "
say trim(text)  # "Hello"
say lower("WORLD")  # "world"
```

## Common mistakes

- Assuming methods modify the string (they return new strings)
- Using wrong case for method names

## Related topics

- [Strings](strings.md)
- [Standard Library](standard-library.md)
