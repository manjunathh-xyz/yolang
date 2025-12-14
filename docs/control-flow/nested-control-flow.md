# Nested Control Flow

Control flow structures can be nested within each other to handle complex decision-making and iteration scenarios.

## Why this exists

Nested control flow allows for hierarchical logic, enabling programs to respond to multiple conditions and iterate within specific contexts.

## How it works

Any control flow statement (check, loop, for, switch) can contain others inside their blocks. Indentation and braces help maintain clarity.

## Examples

Nested conditionals:

```
set x = 10
check x > 5 {
  check x < 15 {
    print("x is between 6 and 14")
  } else {
    print("x is 15 or more")
  }
} else {
  print("x is 5 or less")
}
```

Loop inside conditional:

```
set mode = "active"
check mode == "active" {
  for i in [1, 2, 3] {
    print("Processing " + i)
  }
}
```

## Common mistakes

- Excessive nesting leading to hard-to-read code.
- Forgetting to close braces, causing syntax errors.
- Logic errors due to incorrect nesting order.

## Related topics

- [Conditional Statements](conditional-statements.md)
- [Loops](loops.md)
- [For Loops](for-loops.md)
