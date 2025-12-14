# String Helpers

Built-in functions for string manipulation.

## Why this exists

Strings are common in programs, and helper functions simplify text processing.

## How it works

String helpers operate on string values, returning modified strings or arrays of strings.

## Examples

```kx
set text = "  Hello, World!  "

# Trim whitespace
set clean = trim(text)  # "Hello, World!"

# Case conversion
set upper = upper("hello")  # "HELLO"
set lower = lower("WORLD")  # "world"

# Split into array
set words = split("a,b,c", ",")  # ["a", "b", "c"]

# Length
set length = len("hello")  # 5
```

## Common mistakes

- Passing non-string arguments to string functions
- Forgetting that strings are immutable

## Related topics

- [Strings](../language-basics/strings.md)
- [String Methods](../language-basics/string-methods.md)
- [Arrays](../language-basics/arrays.md)
