# Functions

Functions allow you to organize code into reusable blocks that can be called with different inputs.

## Defining Functions

Use `fn` followed by a name, parameters in parentheses, and a block:

```kx
fn greet(name) {
  say "Hello, " + name + "!"
}
```

## Calling Functions

Call a function by name with arguments:

```kx
greet("World")  # Outputs: Hello, World!
```

## Parameters

Parameters receive values when the function is called:

```kx
fn add(a, b) {
  return a + b
}

set result = add(2, 3)
say result  # Outputs: 5
```

Parameters are passed by value and become local variables.

## Return Values

Use `return` to exit and return a value:

```kx
fn multiply(x, y) {
  return x * y
}

say multiply(4, 5)  # Outputs: 20
```

Without `return`, functions return `null`:

```kx
fn print_message(msg) {
  say msg
}

set result = print_message("Hello")
say result  # Outputs: null
```

## Function Scope

Variables inside functions are local:

```kx
fn test() {
  set local = "inside"
  return local
}

say test()  # Outputs: inside
say local   # Error: undefined
```

Functions access global variables:

```kx
set global = "world"

fn greet() {
  return "Hello, " + global
}

say greet()  # Outputs: Hello, world
```

## Recursion

Functions can call themselves:

```kx
fn factorial(n) {
  check n <= 1 {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}

say factorial(5)  # Outputs: 120
```

## Declaration Order

Functions must be defined before use:

```kx
fn helper() {
  say "Helper"
}

fn main() {
  helper()  # Works
}

main()
```

## Best Practices

- Use descriptive names
- Keep functions focused on one task
- Use parameters for flexibility
- Return meaningful values
- Document complex functions with comments

## Next Steps

Learn about [control flow](control-flow.md) to add decision-making to programs.