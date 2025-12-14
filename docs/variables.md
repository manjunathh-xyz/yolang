# Variables

Variables in Kexra store values that can be used and modified throughout your program.

## Declaring Variables

Use the `set` keyword to create a variable and assign it a value:

```kx
set name = "Alice"
set age = 25
set pi = 3.14159
```

Variable names must be unique within their scope and follow identifier rules.

## Types

Kexra has two main types:

### Numbers

Numbers are written as digits, optionally with a decimal point:

```kx
set integer = 42
set float = 3.14
```

Numbers support basic arithmetic operations.

### Strings

Strings are enclosed in double quotes:

```kx
set greeting = "Hello, World!"
set name = "Kexra"
```

Strings can be concatenated with the `+` operator:

```kx
set fullGreeting = greeting + " My name is " + name
```

## Variable Scope

Variables are accessible within the scope where they're defined:

- **Global scope**: Variables defined at the top level are accessible everywhere
- **Function scope**: Variables defined inside functions are local to that function

```kx
set globalVar = "I'm global"

fn myFunction() {
  set localVar = "I'm local"
  say globalVar  # Works
  say localVar   # Works
}

myFunction()
say globalVar  # Works
say localVar   # Error: undefined variable
```

## Reassignment

Variables can be reassigned to new values:

```kx
set counter = 0
set counter = counter + 1  # counter is now 1
```

## Using Variables

Variables can be used in expressions:

```kx
set x = 10
set y = 20
set sum = x + y
say sum  # Outputs: 30
```

## Best Practices

- Use descriptive variable names
- Initialize variables before use
- Be aware of scope when defining variables in functions

## Next Steps

Learn about [functions](functions.md) to organize your code into reusable blocks.