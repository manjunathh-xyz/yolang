# Errors

Kexra provides clear, helpful error messages to assist with debugging and learning.

## Error Philosophy

Errors are designed to be:

- **Clear**: Easy to understand what went wrong
- **Helpful**: Include suggestions for fixing issues
- **Educational**: Explain programming concepts
- **Non-fatal**: Don't crash unnecessarily

## Error Types

### SyntaxError

Syntax errors occur when code doesn't follow grammar rules:

```bash
kex run broken.kx
```

```
❌ SyntaxError
File: broken.kx
Line: 3

  set x == 10
        ^^

Hint: Use "=" for assignment, not "=="
```

Common causes:
- Missing keywords
- Incorrect operators
- Malformed expressions
- Unmatched braces

### RuntimeError

Runtime errors happen during execution:

```bash
kex> say undefined_var
```

```
❌ RuntimeError
Undefined variable 'undefined_var'
Make sure the variable is defined before use
```

Common causes:
- Undefined variables
- Type mismatches
- Invalid function arguments

## Error Format

All errors include:

- **Type**: SyntaxError or RuntimeError
- **Location**: File name and line number
- **Code snippet**: Problematic line with pointer (^)
- **Hint**: Suggestion for fixing the error

## Common Mistakes

### Undefined Variables

```kx
say x  # Error: undefined
```

**Fix**: Define variables before use:

```kx
set x = 10
say x
```

### Incorrect Assignment

```kx
set x == 10  # Error
```

**Fix**: Use single `=`:

```kx
set x = 10
```

### Missing Function Definitions

```kx
say my_func()  # Error: undefined function
```

**Fix**: Define functions before calling:

```kx
fn my_func() {
  return "Hello"
}

say my_func()
```

### Scope Issues

```kx
fn test() {
  set local = "inside"
}

test()
say local  # Error: undefined
```

**Fix**: Variables inside functions are local.

## Debugging Tips

1. **Read the error message** carefully
2. **Check line numbers** for location
3. **Look at the hint** for suggestions
4. **Use the REPL** to test small pieces
5. **Verify variable definitions** and scope

## Error Recovery

In the REPL, errors don't stop execution:

```bash
kex> say undefined
❌ RuntimeError: Undefined variable 'undefined'
kex> say "Continue working"
Continue working
```

In files, fix errors one at a time.

## Best Practices

- Define variables before use
- Define functions before calling
- Use descriptive names to avoid typos
- Test code in the REPL first
- Read error messages and hints

## Next Steps

Learn about [project structure](project-structure.md) for organizing code.