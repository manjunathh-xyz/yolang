# Switch Statements

Switch statements allow selecting one of many code blocks to execute based on the value of an expression.

## Why this exists

Switch provides a more readable alternative to long chains of if-else statements when comparing a single value against multiple possibilities.

## How it works

Use `switch` followed by an expression, then a block containing `case` labels with values, and optionally a `default` case. Execution jumps to the matching case and continues until the end of the switch block.

## Examples

Basic switch:

```
set day = 3
switch day {
  case 1: print("Monday")
  case 2: print("Tuesday")
  case 3: print("Wednesday")
  default: print("Other day")
}
```

Switch with multiple cases:

```
set grade = "A"
switch grade {
  case "A": print("Excellent")
  case "B": print("Good")
  case "C": print("Average")
  default: print("Needs improvement")
}
```

## Common mistakes

- Forgetting the `default` case for unhandled values.
- Using non-constant values in `case` labels.
- Assuming cases fall through (they don't; each case executes independently).

## Related topics

- [Conditional Statements](conditional-statements.md)
- [Expressions](../language-basics/expressions.md)
- [Break and Continue](break-continue.md)
