# Ternary Expressions

Ternary expressions provide a compact way to choose between two values based on a condition.

## Why this exists

Ternary expressions allow conditional logic within expressions, avoiding the need for full if-else blocks when assigning values.

## How it works

Use the syntax `condition ? true_expression : false_expression`. If the condition is truthy, evaluate the true expression; otherwise, the false expression.

## Examples

Basic ternary:

```
set age = 20
set status = age >= 18 ? "Adult" : "Minor"
print(status)  // "Adult"
```

In calculations:

```
set x = 5
set result = x > 0 ? x * 2 : 0
print(result)  // 10
```

## Common mistakes

- Using ternary for side effects (use if-else instead).
- Forgetting parentheses for complex conditions due to operator precedence.
- Nesting too deeply, reducing readability.

## Related topics

- [Conditional Statements](conditional-statements.md)
- [Expressions](../language-basics/expressions.md)
- [Operator Precedence](../language-basics/operator-precedence.md)
