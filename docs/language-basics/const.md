# const

Constants in Kexra store immutable values that cannot be reassigned after initialization.

## Why this exists

Constants ensure that certain values remain unchanged throughout program execution, preventing accidental modifications.

## How it works

Use `const` to declare constants. They must be initialized at declaration and cannot be reassigned.

## Examples

```kx
const pi = 3.14159
say pi  # Works
pi = 3.14  # Error: cannot reassign constant
```

## Common mistakes

- Trying to reassign constants
- Declaring constants without initialization

## Related topics

- [Variables](variables.md)
- [Data Types](data-types.md)
