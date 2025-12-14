# Async Functions

Functions that can perform asynchronous operations.

## Why this exists

Async functions enable non-blocking I/O and concurrent operations.

## How it works

Async functions can use await to pause execution until asynchronous operations complete.

## Examples

```kx
fn async fetchData(url) {
  set response = await httpGet(url)
  return parseJson(response)
}

fn processData() {
  set data = await fetchData("api/data")
  return data.process()
}
```

## Common mistakes

- Using await in non-async functions
- Not handling async errors
- Blocking the event loop

## Related topics

- [Await Semantics](../async-execution-model/await-semantics.md)
- [Async Errors](../error-handling/async-errors.md)
- [Defining Functions](defining-functions.md)
