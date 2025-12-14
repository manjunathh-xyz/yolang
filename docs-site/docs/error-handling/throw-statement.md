# Throw Statement

The throw statement explicitly raises runtime errors.

## Why this exists

Throw allows functions to signal failure conditions to callers, enabling proper error handling and recovery.

## How it works

Throw takes an expression that becomes the error value. Execution stops and the error propagates up the call stack.

## Examples

```kx
fn validateAge(age) {
  check age < 0 {
    throw "Age cannot be negative"
  }
  check age > 150 {
    throw "Age seems unrealistic"
  }
  return age
}

fn createUser(name, age) {
  check typeof(name) != "string" {
    throw "Name must be a string"
  }
  set validAge = validateAge(age)
  return { name: name, age: validAge }
}

try {
  set user = createUser("Alice", -5)
} catch error {
  say "User creation failed: " + error
}
```

## Common mistakes

- Throwing non-string values
- Not providing descriptive error messages
- Using throw for control flow instead of errors

## Related topics

- [Try/Catch/Finally](try-catch-finally.md)
- [Error Propagation](error-propagation.md)
- [Runtime Errors](runtime-errors.md)
