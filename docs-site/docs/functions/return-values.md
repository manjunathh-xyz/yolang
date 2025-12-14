# Return Values

How functions return results to callers.

## Why this exists

Return values allow functions to produce outputs and enable function composition.

## How it works

The return statement exits the function and sends a value back to the caller.

## Examples

```kx
fn square(x) {
  return x * x
}

set result = square(4)  # 16

fn isEven(n) {
  return n % 2 == 0
}

check isEven(6) {
  say "Even"
}
```

## Common mistakes

- Forgetting return statement
- Returning wrong types
- Not assigning return values

## Related topics

- [Defining Functions](defining-functions.md)
- [Parameters](parameters.md)
- [Expressions](../language-basics/expressions.md)
