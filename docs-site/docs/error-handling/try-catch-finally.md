# Try/Catch/Finally

Try/catch/finally blocks handle runtime errors gracefully, allowing programs to recover from failures.

## Why this exists

Error handling prevents programs from crashing unexpectedly and enables robust applications that can handle unexpected conditions.

## How it works

Code in the try block executes normally. If a runtime error occurs, execution jumps to the catch block with the error bound to the specified parameter. The finally block always executes, regardless of whether an error occurred.

## Examples

```kx
# Basic try/catch
try {
  set result = 10 / 0
} catch error {
  say "Error occurred: " + error
}

# With finally
try {
  set file = open("data.txt")
  processData(file)
} catch error {
  say "Failed to process file: " + error
} finally {
  close(file)
}

# Nested try blocks
try {
  try {
    riskyOperation()
  } catch innerError {
    handleInnerError(innerError)
  }
} catch outerError {
  handleOuterError(outerError)
}
```

## Common mistakes

- Forgetting to specify a catch parameter
- Not using finally for cleanup operations
- Catching errors too broadly

## Related topics

- [Runtime Errors](runtime-errors.md)
- [Error Propagation](error-propagation.md)
- [Async Errors](async-errors.md)
