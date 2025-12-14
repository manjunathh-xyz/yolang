# Syntax

This page covers the basic syntax and structure of Kexra programs.

## Program Structure

A Kexra program consists of statements. Each statement is written on its own line and performs some action.

```kx
say "Hello"
set x = 42
```

## Statements

Kexra has several types of statements:

- **Output statements**: `say`
- **Assignment statements**: `set`
- **Function definitions**: `fn`
- **Control flow**: `check`, `loop`
- **Return statements**: `return`

## Expressions

Expressions produce values and can be used in assignments, function calls, and conditions.

```kx
# Literal values
42
"Hello"

# Variables
myVariable

# Binary operations
x + y
a == b

# Function calls
myFunction(arg1, arg2)
```

## Blocks

Blocks group statements together using curly braces `{}`. They're used in functions, conditionals, and loops.

```kx
fn example() {
  say "Inside a block"
  set x = 10
}
```

## Comments

Comments start with `#` and continue to the end of the line:

```kx
# This is a comment
set x = 5  # This is also a comment
```

## Whitespace

Kexra uses line breaks to separate statements. Extra whitespace (spaces and tabs) is ignored except within string literals.

## Keywords

The following words are reserved and cannot be used as variable or function names:

- `say`
- `set`
- `check`
- `else`
- `loop`
- `fn`
- `return`

## Identifiers

Variable and function names must start with a letter or underscore, followed by letters, digits, or underscores:

```kx
validName
_another_valid
invalid-name  # Hyphens not allowed
```

## Operators

Kexra supports these operators, in order of precedence:

1. `()` - Grouping
2. `*`, `/` - Multiplication, division
3. `+`, `-` - Addition, subtraction
4. `==`, `!=` - Equality
5. `>`, `<`, `>=`, `<=` - Comparison

## Next Steps

Now that you understand the basic syntax, learn about [variables](variables.md) to start working with data.