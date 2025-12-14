# Booleans

Booleans in Kexra represent true or false values, used in conditional logic.

## Why this exists

Booleans enable decision-making and control flow based on conditions.

## How it works

Boolean literals are `true` and `false`. Comparison operations return booleans.

## Examples

```kx
set is_ready = true
check is_ready {
  say "Ready!"
}
```

## Common mistakes

- Using 1/0 instead of true/false
- Confusing boolean and string values

## Related topics

- [Control Flow](control-flow.md)
- [Expressions](expressions.md)
