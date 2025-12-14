# Control Flow

Control flow statements allow your program to make decisions and repeat actions based on conditions.

## Conditional Statements

Use `check` to execute code only when a condition is true:

```kx
set age = 18

check age >= 18 {
  say "You are an adult"
}
```

### If-Else

Add `else` to handle the alternative case:

```kx
check age >= 18 {
  say "You are an adult"
} else {
  say "You are a minor"
}
```

Conditions can use comparison operators:

```kx
set score = 85

check score >= 90 {
  say "Excellent!"
} else check score >= 80 {
  say "Good job!"
} else {
  say "Keep trying!"
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

## Boolean Expressions

Conditions must evaluate to true or false. Kexra considers any non-null value as true:

```kx
check 1 {        # true
  say "This runs"
}

check 0 {        # true (0 is a number)
  say "This also runs"
}

check "" {       # true (empty string is still a string)
  say "This runs too"
}

check null {     # false
  say "This doesn't run"
}
```

## Comparison Operators

Use these operators in conditions:

- `==` - equal to
- `!=` - not equal to
- `>` - greater than
- `<` - less than
- `>=` - greater than or equal
- `<=` - less than or equal

```kx
set x = 10
set y = 20

check x < y {
  say "x is less than y"
}

check x != y {
  say "x is not equal to y"
}
```

## Logical Operators

Kexra doesn't have explicit logical operators yet, but you can use nested conditions:

```kx
set age = 25
set hasLicense = true

check age >= 18 {
  check hasLicense {
    say "You can drive"
  } else {
    say "You need a license"
  }
} else {
  say "You're too young to drive"
}
```

## Loop Control

Loops continue until the condition becomes false. Make sure to modify the condition variable:

```kx
set count = 10
loop count > 0 {
  say count
  set count = count - 1
}
say "Blast off!"
```

## Infinite Loops

Be careful not to create loops that never end:

```kx
# This would loop forever - don't do this!
# loop true {
#   say "This never stops"
# }
```

## Best Practices

- Use clear, descriptive conditions
- Avoid deeply nested conditionals when possible
- Ensure loop conditions will eventually become false
- Use functions to organize complex conditional logic

## Next Steps

Explore the [REPL](repl.md) for interactive experimentation with control flow.