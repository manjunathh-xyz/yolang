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

## Boolean Values

Kexra has explicit boolean values:

```kx
set is_adult = true
set is_minor = false

check is_adult {
  say "Can vote"
}
```

## Boolean Logic

Kexra considers any non-null value as truthy, but you can use explicit booleans:

```kx
check true {     # true
  say "Runs"
}

check false {    # false
  say "Doesn't run"
}

check 1 {        # true (truthy)
  say "Also runs"
}

check null {     # false
  say "Doesn't run"
}
```

## Logical Operators

Use `and`, `or`, and `not` for complex conditions:

```kx
set age = 25
set has_license = true

check age >= 18 and has_license {
  say "Can drive"
}

check age < 18 or not has_license {
  say "Cannot drive"
}

check not (age < 18) {
  say "Is adult"
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

## For Loops

Use `for` with ranges for counting loops:

```kx
for i in 1..5 {
  say i
}
```

This outputs:
```
1
2
3
4
5
```

## While Loops

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

Use `break` to exit a loop early:

```kx
set i = 0
loop true {
  check i >= 5 {
    break
  }
  say i
  set i = i + 1
}
say "Done!"
```

Use `continue` to skip to the next iteration:

```kx
for i in 1..10 {
  check i % 2 == 0 {
    continue
  }
  say i  # Only odd numbers
}
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