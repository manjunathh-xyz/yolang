# Functions

Functions allow you to organize code into reusable blocks that can be called with different inputs.

## Defining Functions

Use the `fn` keyword followed by the function name, parameters in parentheses, and a block of code:

```kx
fn greet(name) {
  say "Hello, " + name + "!"
}
```

## Calling Functions

Call a function by writing its name followed by arguments in parentheses:

```kx
greet("World")  # Outputs: Hello, World!
```

## Parameters

Functions can accept parameters, which become local variables inside the function:

```kx
fn add(a, b) {
  return a + b
}

set result = add(2, 3)
say result  # Outputs: 5
```

Parameters are passed by value, meaning the function receives copies of the values.

## Return Values

Use `return` to exit a function and return a value:

```kx
fn multiply(x, y) {
  return x * y
}

say multiply(4, 5)  # Outputs: 20
```

If no `return` statement is executed, the function returns `null`:

```kx
fn printMessage(msg) {
  say msg
  # No return statement
}

set result = printMessage("Hello")
say result  # Outputs: null
```

## Function Scope

Variables defined inside functions are local to that function:

```kx
fn test() {
  set local = "inside"
  return local
}

say test()  # Outputs: inside
say local   # Error: undefined variable
```

Functions can access global variables:

```kx
set global = "world"

fn greet() {
  return "Hello, " + global
}

say greet()  # Outputs: Hello, world
```

## Recursion

Functions can call themselves (recursion):

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

## Function Declaration Order

Functions must be defined before they are called:

```kx
fn helper() {
  say "Helper function"
}

fn main() {
  helper()  # This works
}

main()
```

## Best Practices

- Use descriptive function names
- Keep functions focused on a single task
- Use parameters to make functions flexible
- Return meaningful values when appropriate

## Next Steps

Learn about [control flow](control-flow.md) to add decision-making to your programs.