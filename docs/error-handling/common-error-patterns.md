# Common Error Patterns

Recognizing and handling frequent error scenarios improves code reliability.

## Why this exists

Certain error conditions occur commonly across programs, and standardized handling patterns prevent bugs.

## How it works

Common patterns include validation checks, resource cleanup, and graceful degradation. Use try/catch strategically around risky operations.

## Examples

```kx
# Input validation
fn processInput(input) {
  check input == null {
    throw "Input cannot be null"
  }
  check typeof(input) != "string" {
    throw "Input must be a string"
  }
  return input.toUpperCase()
}

# Resource management
fn readFile(path) {
  set file = null
  try {
    set file = open(path)
    set content = file.read()
    return content
  } catch error {
    throw "Failed to read file: " + error
  } finally {
    check file != null {
      file.close()
    }
  }
}

# Graceful degradation
fn getConfig() {
  try {
    return loadConfigFile()
  } catch error {
    say "Using default config due to: " + error
    return getDefaultConfig()
  }
}
```

## Common mistakes

- Not validating inputs before processing
- Failing to clean up resources in error paths
- Making programs brittle by not handling expected failures

## Related topics

- [Try/Catch/Finally](try-catch-finally.md)
- [Runtime Errors](runtime-errors.md)
- [Debugging Strategies](debugging-strategies.md)
