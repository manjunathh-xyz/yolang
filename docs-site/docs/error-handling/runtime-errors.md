# Runtime Errors

Runtime errors occur during program execution when operations cannot be completed as expected.

## Why this exists

Runtime errors provide feedback when a program attempts invalid operations, preventing silent failures and helping developers identify and fix issues.

## How it works

Runtime errors are thrown when the interpreter encounters conditions like division by zero, accessing undefined properties, or type mismatches. Execution halts and the error propagates up the call stack unless caught.

## Examples

```kx
# Division by zero
set result = 10 / 0  # Throws RuntimeError: Division by zero

# Accessing undefined property
set obj = {}
say obj.missing  # Throws RuntimeError: Property 'missing' does not exist

# Type mismatch in operation
set str = "hello"
set num = str + 5  # Throws RuntimeError: Cannot add string and number
```

## Common mistakes

- Assuming operations will succeed without validation
- Not handling potential error conditions
- Confusing runtime errors with syntax errors

## Related topics

- [Try/Catch/Finally](try-catch-finally.md)
- [Error Propagation](error-propagation.md)
- [Debugging Strategies](debugging-strategies.md)
