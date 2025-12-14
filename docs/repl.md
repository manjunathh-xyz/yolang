# REPL

The Read-Eval-Print Loop (REPL) is an interactive environment for running Kexra code and experimenting with the language.

## Starting the REPL

Launch the REPL with:

```bash
kex repl
```

You'll see:

```
🎧 Kexra REPL v0.4.1
Type 'help' for commands, 'exit' to quit
kex>
```

## Basic Usage

Type statements at the prompt and press Enter to execute them:

```bash
kex> set x = 42
kex> say x
42
kex> set y = x * 2
kex> say y
84
```

## Multiline Input

For statements that span multiple lines (functions, conditionals, loops), the REPL automatically handles continuation:

```bash
kex> fn add(a, b) {
...   return a + b
... }
kex> say add(2, 3)
5
```

The `...` prompt indicates continuation lines.

## Built-in Commands

The REPL has several built-in commands:

### help

Show available commands:

```bash
kex> help
Available commands:
  help     - Show this help message
  vars     - Display current variables
  clear    - Clear the terminal screen
  exit     - Exit the REPL
```

### vars

Display all current variables and their values:

```bash
kex> set name = "Kexra"
kex> set version = 0.4
kex> vars
Current variables:
  name: "Kexra"
  version: 0.4
```

### clear

Clear the terminal screen:

```bash
kex> clear
```

### exit

Quit the REPL:

```bash
kex> exit
Goodbye!
```

## Variable Persistence

Variables defined in the REPL persist across commands:

```bash
kex> set counter = 0
kex> set counter = counter + 1
kex> say counter
1
kex> set counter = counter + 1
kex> say counter
2
```

## Error Handling

The REPL shows errors clearly and continues running:

```bash
kex> say undefinedVariable
❌ RuntimeError
Undefined variable 'undefinedVariable'
Make sure the variable is defined before use
kex> say "Still working!"
Still working!
```

## Function Definitions

You can define and use functions interactively:

```bash
kex> fn square(x) {
...   return x * x
... }
kex> say square(5)
25
```

## Limitations

- Functions must be defined before use (same as in files)
- Multi-line input is handled automatically
- No command history (use up/down arrows if supported by your terminal)

## Best Practices

- Use the REPL to test small code snippets
- Define helper functions for complex calculations
- Use `vars` to inspect your current state
- Experiment with different approaches before writing full programs

## Next Steps

Learn about the [CLI](cli.md) for running Kexra files and other command-line options.