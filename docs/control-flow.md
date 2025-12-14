# Control Flow

Control flow statements allow programs to make decisions and repeat actions.

## Conditional Statements

Use `check` to execute code based on conditions:

```kx
set age = 18

check age >= 18 {
  say "You are an adult"
}
```

## If-Else

Add `else` for alternative execution:

```kx
check age >= 18 {
  say "Adult"
} else {
  say "Minor"
}
```

## Nested Conditions

Use multiple conditions for complex logic:

```kx
set score = 85

check score >= 90 {
  say "Excellent"
} else check score >= 80 {
  say "Good"
} else {
  say "Needs improvement"
}
```

## Boolean Logic

Kexra considers any non-null value as true:

```kx
check 1 {        # true
  say "Runs"
}

check 0 {        # true (0 is a number)
  say "Also runs"
}

check "" {       # true (empty string)
  say "Runs too"
}

check null {     # false
  say "Doesn't run"
}
```

## Comparison Operators

Use these for conditions:

- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal
- `<=` less than or equal

```kx
set x = 10
set y = 20

check x < y {
  say "x is smaller"
}

check x != y {
  say "x and y differ"
}
```

## Loops

Use `loop` to repeat code while a condition is true:

```kx
set i = 0
loop i < 5 {
  say i
  set i = i + 1
}
```

This outputs:
```
0
1
2
3
4
```

## Loop Control

Modify the condition variable to exit:

```kx
set count = 10
loop count > 0 {
  say count
  set count = count - 1
}
say "Done!"
```

## Infinite Loops

Avoid loops that never end:

```kx
# Don't do this:
# loop true {
#   say "Never stops"
# }
```

## Common Patterns

### Counting Loop

```kx
set i = 1
loop i <= 10 {
  say "Count: " + i
  set i = i + 1
}
```

### Sum Calculation

```kx
set sum = 0
set i = 1
loop i <= 100 {
  set sum = sum + i
  set i = i + 1
}
say "Sum: " + sum
```

## Best Practices

- Use clear, readable conditions
- Avoid deeply nested conditionals
- Ensure loops have exit conditions
- Use functions for complex logic
- Test edge cases

## Next Steps

Explore the [REPL](repl.md) for interactive experimentation.