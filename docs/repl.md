# REPL

The Read-Eval-Print Loop (REPL) provides an interactive environment for running Kexra code.

## Starting the REPL

Launch the REPL with:

```bash
kex repl
```

You'll see:

```
🎧 Kexra REPL v0.4.2
Type 'help' for commands, 'exit' to quit
kex>
```

## Basic Usage

Type statements and press Enter to execute:

```bash
kex> set x = 42
kex> say x
42
```

## Multiline Input

For blocks, the REPL handles continuation automatically:

```bash
kex> fn square(x) {
...   return x * x
... }
kex> say square(5)
25
```

The `...` prompt indicates continuation lines.

## Built-in Commands

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

Display all current variables:

```bash
kex> set name = "Kexra"
kex> vars
Current variables:
  name: "Kexra"
```

### clear

Clear the screen:

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

Variables persist across commands:

```bash
kex> set counter = 0
kex> set counter = counter + 1
kex> say counter
1
```

## Error Handling

Errors don't crash the REPL:

```bash
kex> say undefined
❌ RuntimeError: Undefined variable 'undefined'
kex> say "Still working"
Still working
```

## Function Definitions

Define and use functions interactively:

```bash
kex> fn add(a, b) {
...   return a + b
... }
kex> say add(2, 3)
5
```

## Use Cases

- Test small code snippets
- Learn language features
- Debug programs
- Experiment with ideas

## Limitations

- Functions must be defined before use
- No command history (use terminal features)
- Single-threaded execution

## Next Steps

Learn about the [CLI](cli.md) for running files and other commands.