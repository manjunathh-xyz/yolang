# Project Structure

This guide explains how to organize Kexra projects and files.

## Basic Structure

A typical Kexra project:

```
my-project/
├── main.kx          # Main entry point
├── utils.kx         # Utility functions
├── data.kx          # Data definitions
└── examples/
    ├── hello.kx
    └── test.kx
```

## File Organization

### Entry Point

Use `main.kx` as the primary file:

```bash
kex run main.kx
```

### Modular Files

Split code into logical modules:

```kx
# utils.kx
fn calculate_sum(a, b) {
  return a + b
}

# main.kx
# Include utility functions by defining them
fn calculate_sum(a, b) {
  return a + b
}

set result = calculate_sum(5, 3)
say result
```

## Naming Conventions

- Use `.kx` extension for Kexra files
- Use descriptive names: `user_manager.kx`, `math_utils.kx`
- Use lowercase with underscores: `data_processor.kx`

## Code Organization

### Functions First

Define functions before using them:

```kx
# Good: functions defined first
fn helper() {
  return "help"
}

fn main() {
  say helper()
}

main()
```

### Logical Grouping

Group related functions together:

```kx
# Math functions
fn add(a, b) {
  return a + b
}

fn multiply(a, b) {
  return a * b
}

# String functions
fn greet(name) {
  return "Hello, " + name
}
```

## Examples Directory

Keep examples in a dedicated folder:

```
examples/
├── basic/
│   ├── hello.kx
│   └── variables.kx
├── advanced/
│   ├── functions.kx
│   └── recursion.kx
└── algorithms/
    ├── fibonacci.kx
    └── sorting.kx
```

## Best Practices

- Keep files focused on single responsibilities
- Use consistent naming
- Document complex functions
- Test examples regularly
- Version control your projects

## Running Projects

### Single File

```bash
kex run main.kx
```

### Multiple Files

Load dependencies manually by copying function definitions.

## Next Steps

Check the [FAQ](faq.md) for common questions.