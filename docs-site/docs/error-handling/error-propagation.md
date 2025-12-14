# Error Propagation

Errors propagate up the call stack until caught or the program terminates.

## Why this exists

Error propagation ensures that errors are not silently ignored and allows higher-level code to decide how to handle failures.

## How it works

When an error is thrown in a function, execution of that function stops and the error bubbles up to the caller. If no catch block handles it, the program exits with an error message.

## Examples

```kx
fn divide(a, b) {
  check b == 0 {
    throw "Division by zero"
  }
  return a / b
}

fn calculate() {
  set result = divide(10, 0)  # Error propagates here
  return result * 2
}

try {
  set final = calculate()  # Error caught here
} catch error {
  say "Calculation failed: " + error
}
```

## Common mistakes

- Not re-throwing errors in catch blocks when appropriate
- Assuming errors will be caught automatically
- Losing error context during propagation

## Related topics

- [Try/Catch/Finally](try-catch-finally.md)
- [Runtime Errors](runtime-errors.md)
- [Async Errors](async-errors.md)
