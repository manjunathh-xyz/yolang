# Kex Test

Run test files in the project.

## Why this exists

Automated testing ensures code correctness and prevents regressions.

## How it works

`kex test` discovers and runs all .test.kx files in the current directory.

## Examples

```bash
# Run all tests
kex test

# Test files are named with .test.kx extension
# math.test.kx
# string.test.kx
```

## Common mistakes

- Not naming test files correctly
- Tests that don't fail on errors
- Not running tests before commits

## Related topics

- [Kex Command](kex-command.md)
- [Error Output](error-output.md)
- [Debugging Strategies](../error-handling/debugging-strategies.md)
