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

## Default Parameters

Provide default values for parameters:

```kx
fn greet(name = "guest") {
  say "Hello, " + name + "!"
}

greet()        # Hello, guest!
greet("Alice") # Hello, Alice!
```

## Rest Parameters

Collect remaining arguments into an array:

```kx
fn sum(...nums) {
  set total = 0
  for i in 1..len(nums) {
    set total = total + nums[i-1]
  }
  return total
}

say sum(1, 2, 3, 4)  # Outputs: 10
```

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

## Closures

Functions capture variables from their defining scope:

```kx
fn make_counter() {
  set count = 0
  fn increment() {
    set count = count + 1
    return count
  }
  return increment
}

set counter = make_counter()
say counter()  # 1
say counter()  # 2
```

## Higher-Order Functions

Functions can be passed as arguments and returned from other functions:

```kx
fn apply_twice(func, value) {
  return func(func(value))
}

fn double(x) {
  return x * 2
}

say apply_twice(double, 3)  # Outputs: 12
```

This enables powerful functional programming patterns.

## Best Practices

- Use descriptive names
- Keep functions focused on one task
- Use parameters for flexibility
- Return meaningful values
- Document complex functions with comments

## Next Steps

Learn about [control flow](control-flow.md) to add decision-making to programs.