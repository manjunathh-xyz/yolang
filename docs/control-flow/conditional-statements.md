# Conditional Statements

Conditional statements execute different blocks of code based on whether a condition evaluates to true or false.

## Why this exists

Conditional statements allow programs to make decisions and branch execution paths, enabling dynamic behavior based on runtime values.

## How it works

Use the `check` keyword followed by a condition expression. If the condition is truthy, execute the following block. Optionally, use `else` to execute an alternative block if the condition is falsy.

Conditions are expressions that evaluate to booleans, numbers, or other values; falsy values include `false`, `0`, `null`, empty strings, empty arrays.

## Examples

Basic conditional:

```
set x = 5
check x > 3 {
  print("x is greater than 3")
}
```

With else:

```
set age = 18
check age >= 18 {
  print("Adult")
} else {
  print("Minor")
}
```

Nested conditionals:

```
set score = 85
check score >= 90 {
  print("A")
} else check score >= 80 {
  print("B")
} else {
  print("C")
}
```

## Common mistakes

- Forgetting to use `check` instead of `if`.
- Not enclosing blocks in braces `{}`.
- Using assignment `=` instead of comparison `==` in conditions.
- Assuming `null` or `0` are truthy.

## Related topics

- [Booleans](../language-basics/booleans.md)
- [Expressions](../language-basics/expressions.md)
- [Operator Precedence](../language-basics/operator-precedence.md)
