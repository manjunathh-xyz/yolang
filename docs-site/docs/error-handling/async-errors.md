# Async Errors

Errors in asynchronous operations follow the same propagation rules as synchronous code.

## Why this exists

Asynchronous operations can fail, and their errors need to be handled consistently with the language's error model.

## How it works

Errors thrown in awaited expressions propagate to the awaiting context. Async functions can throw errors that are caught by try/catch blocks around await expressions.

## Examples

```kx
fn asyncOperation() {
  await delay(1000)
  throw "Operation failed"
}

try {
  await asyncOperation()
} catch error {
  say "Async operation failed: " + error
}

# Error in promise-like operation
fn fetchData() {
  return await httpGet("api/data")
}

try {
  set data = await fetchData()
} catch error {
  say "Failed to fetch data: " + error
}
```

## Common mistakes

- Forgetting that await can throw errors
- Not wrapping async calls in try/catch
- Assuming async errors behave differently from sync errors

## Related topics

- [Try/Catch/Finally](try-catch-finally.md)
- [Error Propagation](error-propagation.md)
- [Async Functions](../functions/async-functions.md)
