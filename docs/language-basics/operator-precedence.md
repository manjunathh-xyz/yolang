# Operator Precedence

Operator precedence determines the order of evaluation in expressions.

## Why this exists

Precedence rules ensure expressions are evaluated consistently and predictably.

## How it works

Higher precedence operators are evaluated before lower ones. Use parentheses to override.

## Examples

```kx
say 2 + 3 * 4  # 14 (multiplication first)
say (2 + 3) * 4  # 20 (parentheses override)
```

## Common mistakes

- Assuming left-to-right evaluation
- Forgetting parentheses for clarity

## Related topics

- [Expressions](expressions.md)
- [Numbers](numbers.md)
