# Defining Functions

Defining functions involves using the `fn` keyword to create reusable code blocks that can be called later.

## Why this exists

Function definitions allow developers to organize code into logical units that can be invoked multiple times.

## How it works

Start with `fn`, followed by the function name, optional parameters in parentheses, and the function body in braces. The body can contain statements and optionally a return statement.

## Examples

Function without parameters:

```
fn say_hello() {
  print("Hello!")
}
```

Function with parameters:

```
fn add(a, b) {
  return a + b
}
```

Function with return:

```
fn square(x) {
  return x * x
}
```

## Common mistakes

- Omitting the `fn` keyword.
- Forgetting parentheses even for no parameters.
- Not enclosing the body in braces.

## Related topics

- [Functions Overview](functions-overview.md)
- [Function Parameters](function-parameters.md)
- [Return Values](return-values.md)
