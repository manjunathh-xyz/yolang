# Parameters

How function parameters work in Kexra.

## Why this exists

Parameters allow functions to accept inputs and perform operations on different data.

## How it works

Parameters are declared in the function signature and bound to argument values when called.

## Examples

```kx
fn greet(name) {
  say "Hello, " + name
}

greet("Alice")  # Hello, Alice

fn add(a, b) {
  return a + b
}

set result = add(2, 3)  # 5
```

## Common mistakes

- Not providing required parameters
- Passing wrong number of arguments
- Confusing parameter names with variables

## Related topics

- [Defining Functions](defining-functions.md)
- [Return Values](return-values.md)
- [Default Parameters](default-parameters.md)
