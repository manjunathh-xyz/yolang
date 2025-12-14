# Variables

Variables store values that can be used and modified throughout your program.

## Declaring Variables

Use `set` to create a variable and assign a value:

```kx
set name = "Alice"
set age = 25
set pi = 3.14159
```

## Data Types

Kexra supports two main types:

### Numbers

Numbers are written as digits, optionally with decimals:

```kx
set integer = 42
set float = 3.14
```

Numbers support arithmetic operations.

### Strings

Strings are enclosed in double quotes:

```kx
set greeting = "Hello, World!"
set name = "Kexra"
```

Strings can be concatenated with `+`:

```kx
set message = greeting + " My name is " + name
```

## Variable Scope

Variables exist within the scope where they're defined:

### Global Scope

Variables at the top level are accessible everywhere:

```kx
set global_var = "I'm global"

fn test() {
  say global_var  # Works
}
```

### Local Scope

Variables inside functions are local to that function:

```kx
fn test() {
  set local_var = "I'm local"
  say local_var  # Works
}

test()
say local_var   # Error: undefined variable
```

## Reassignment

Variables can be reassigned to new values:

```kx
set counter = 0
set counter = counter + 1  # Now 1
```

## Using Variables

Variables can be used in expressions:

```kx
set x = 10
set y = 20
set sum = x + y
say sum  # Outputs: 30
```

## Common Mistakes

### Using Undefined Variables

```kx
say undefined_var  # Error
```

**Fix:** Define variables before use.

### Scope Confusion

```kx
fn test() {
  set x = 10
}

test()
say x  # Error: x is local to test()
```

**Fix:** Understand scope rules.

## Next Steps

Learn about [functions](functions.md) to organize code into reusable blocks.