# Async Call Stacks

Asynchronous operations maintain separate call stacks for error propagation.

## Why this exists

Async call stacks preserve error context across await boundaries, enabling proper debugging.

## How it works

Each async operation has its own stack frame. When an error occurs, the stack trace includes all async frames leading to the error.

## Examples

```kx
fn level3() {
  throw "Error at level 3"
}

fn level2() {
  return await level3()
}

fn level1() {
  return await level2()
}

try {
  await level1()
} catch error {
  say "Caught error: " + error
  # Stack trace shows: level3 -> level2 -> level1
}
```

## Common mistakes

- Not understanding stack traces in async code
- Losing error context across await points

## Related topics

- [Error Propagation](../error-handling/error-propagation.md)
- [Await Semantics](await-semantics.md)
- [Debugging Strategies](../error-handling/debugging-strategies.md)
