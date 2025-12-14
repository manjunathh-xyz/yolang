# Language Basics

This section covers the fundamental concepts of Kexra programs.

## Programs and Statements

A Kexra program consists of statements. Each statement performs an action and is written on its own line.

```kx
say "Hello"
set x = 42
```

## Execution Model

Kexra executes statements from top to bottom, one at a time. The language is interpreted, meaning code runs directly without compilation.

## Blocks

Blocks group statements together using curly braces `{}`. They're used in functions, conditionals, and loops.

```kx
fn example() {
  say "Inside a block"
  set x = 10
}
```

Blocks create scope and control execution flow.

## Comments

Comments start with `#` and continue to the end of the line:

```kx
# This is a comment
set x = 5  # This is also a comment
```

Comments are ignored by the interpreter and are for human readers.

## Keywords

Kexra has these reserved keywords:

- `say`, `set`, `check`, `else`, `loop`, `fn`, `return`

These cannot be used as variable or function names.

## Identifiers

Names for variables and functions must:

- Start with a letter or underscore
- Contain only letters, digits, and underscores
- Be unique within their scope

```kx
valid_name
_another_valid
invalid-name  # Hyphens not allowed
```

## Next Steps

Now that you understand the basics, learn about [variables](variables.md) to work with data.