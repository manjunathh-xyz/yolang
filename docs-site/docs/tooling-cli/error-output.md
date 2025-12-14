# Error Output

How Kexra displays errors and debugging information.

## Why this exists

Clear error messages help developers quickly identify and fix issues.

## How it works

Errors show the error type, location, source code snippet, and helpful hints.

## Examples

```
❌ RuntimeError
File: calculator.kx
Line: 5

  set result = 10 / 0
                  ^

Hint: Division by zero
```

## Common mistakes

- Ignoring error locations
- Not reading the hint messages
- Running code with known errors

## Related topics

- [Runtime Errors](../error-handling/runtime-errors.md)
- [Debugging Strategies](../error-handling/debugging-strategies.md)
- [Kex Test](kex-test.md)
