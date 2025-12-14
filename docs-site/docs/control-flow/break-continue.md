# Break and Continue

Break exits a loop immediately, while continue skips the rest of the current iteration and proceeds to the next.

## Why this exists

These statements provide fine-grained control over loop execution, allowing early termination or skipping specific iterations.

## How it works

`break` terminates the innermost loop and resumes execution after it. `continue` skips the remaining code in the current iteration and jumps to the next iteration check.

## Examples

Using break:

```
set i = 0
loop true {
  set i = i + 1
  check i > 5 {
    break
  }
  print(i)
}
```

Using continue:

```
for num in [1, 2, 3, 4, 5] {
  check num % 2 == 0 {
    continue
  }
  print(num)  // prints odd numbers
}
```

## Common mistakes

- Using `break` or `continue` outside a loop (causes error).
- Forgetting that `break` exits the loop entirely, not just the current block.
- Misusing `continue` in non-loop contexts.

## Related topics

- [Loops](loops.md)
- [For Loops](for-loops.md)
- [Conditional Statements](conditional-statements.md)
