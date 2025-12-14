# Loops

Loops repeatedly execute a block of code as long as a condition remains true.

## Why this exists

Loops enable iteration over data or repetition of tasks until a condition is met, avoiding code duplication.

## How it works

Use the `loop` keyword followed by a condition expression. The block executes repeatedly while the condition is truthy. The condition is checked before each iteration.

## Examples

Basic loop:

```
set i = 0
loop i < 5 {
  print(i)
  set i = i + 1
}
```

Loop with break:

```
set count = 0
loop true {
  set count = count + 1
  check count > 10 {
    break
  }
  print(count)
}
```

## Common mistakes

- Creating infinite loops by not updating the condition variable.
- Forgetting braces around the block.
- Using `loop` without a condition (use `loop true` for infinite loops).

## Related topics

- [Numbers](../language-basics/numbers.md)
- [Variables](../language-basics/variables.md)
- [Arrays](../language-basics/arrays.md)
