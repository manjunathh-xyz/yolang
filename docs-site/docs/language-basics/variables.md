# Variables

Variables in Kexra store values that can be referenced and modified throughout a program.

## Why this exists

Variables allow programs to store and manipulate data, enabling dynamic behavior and reusable computations.

## How it works

Variables are declared using `set` and can hold any value type. They can be reassigned and their values can change during execution.

## Examples

```kx
# Declare a variable
set x 42
say x  # Outputs: 42

# Reassign a variable
set x "hello"
say x  # Outputs: hello

# Use in expressions
set y x + 10  # Error: x is now a string
```

## Common mistakes

- Using `set` without a value (variables must be initialized)
- Confusing variable names with keywords

## Related topics

- [Constants](constants.md)
- [Data Types](data-types.md)
- [Scope](scope.md)
