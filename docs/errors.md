# Errors

Kexra provides clear, helpful error messages to assist with debugging and learning. This page explains the error system and common issues.

## Error Philosophy

Kexra errors are designed to be:

- **Clear**: Easy to understand what went wrong
- **Helpful**: Include suggestions for fixing the problem
- **Educational**: Explain programming concepts
- **Non-fatal**: Don't crash the entire program when possible

## Error Types

### SyntaxError

Syntax errors occur when the code doesn't follow Kexra's grammar rules:

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
- Incorrect operator usage
- Malformed function calls
- Unmatched parentheses or braces

### RuntimeError

Runtime errors happen during program execution:

```bash
kex> say undefinedVar
```

```
❌ RuntimeError
Undefined variable 'undefinedVar'
Make sure the variable is defined before use
```

Common causes:
- Using undefined variables
- Type mismatches in operations
- Invalid function arguments
- Division by zero (future feature)

## Error Format

All errors include:

- **Error type**: SyntaxError or RuntimeError
- **Location**: File name and line number
- **Code snippet**: The problematic line with a pointer (^)
- **Hint**: Suggestion for fixing the error

## Common Mistakes

### Forgetting to Define Variables

```kx
say x  # Error: undefined variable
```

**Fix**: Define variables before use:

```kx
set x = 10
say x
```

### Incorrect Assignment

```kx
set x == 10  # Error: unexpected ==
```

**Fix**: Use single `=` for assignment:

```kx
set x = 10
```

### Missing Function Definitions

```kx
say myFunction()  # Error: undefined function
```

**Fix**: Define functions before calling them:

```kx
fn myFunction() {
  return "Hello"
}

say myFunction()
```

### Scope Issues

```kx
fn test() {
  set local = "inside"
}

test()
say local  # Error: undefined variable
```

**Fix**: Variables defined in functions are local:

```kx
fn test() {
  set local = "inside"
  say local  # This works
}

test()
```

### Type Errors

```kx
set result = "hello" + 123  # This works (string concatenation)
set result = 123 - "hello"  # Error: invalid operands
```

**Fix**: Ensure compatible types for operations.

## Debugging Tips

1. **Read the error message carefully** - it often tells you exactly what's wrong
2. **Check line numbers** - errors point to the specific problematic line
3. **Look at the hint** - suggestions are provided when possible
4. **Use the REPL** - test small pieces of code interactively
5. **Check variable definitions** - ensure variables are defined in the right scope

## Error Recovery

In the REPL, errors don't stop execution - you can continue working:

```bash
kex> say undefined
❌ RuntimeError: Undefined variable 'undefined'
kex> say "Still working!"
Still working!
```

In files, the first error stops execution. Fix errors one at a time.

## Best Practices

- Define variables before use
- Define functions before calling them
- Use descriptive variable names to avoid typos
- Test code in the REPL before putting it in files
- Read error messages and hints carefully

## Next Steps

Learn about the [CLI](cli.md) to understand how to run files and get help with commands.