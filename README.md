# Yolang

A playful, beginner-friendly scripting language.

## What is Yolang?

Yolang is a simple interpreted scripting language designed for beginners, hobbyists, and anyone interested in language design. It's built with TypeScript and runs on Node.js.

## Why Yolang?

- Easy to learn syntax inspired by casual developer English
- Interpreted for quick feedback
- Open-source and extensible
- Fun way to explore programming language concepts

## Example

```yo
set x = 10
check x > 5 {
  say "big"
} else {
  say "small"
}

loop x < 15 {
  say x
  set x = x + 1
}
```

## How to Run

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Run a file: `yo run examples/hello.yo`
5. Start REPL: `yo repl`

## Features

- Variables with `set`
- Output with `say`
- Arithmetic: `+ - * /`
- Comparisons: `> < >= <= == !=`
- Conditionals: `check / else`
- Loops: `loop`
- Comments: `#`
- Numbers and strings

## CLI Usage

```bash
yo run <file.yo>     # Run a Yolang file
yo repl              # Start interactive REPL
yo version           # Show version
yo help              # Show help
```

## REPL

The interactive REPL allows you to experiment with Yolang code in real-time.

```bash
yo repl
```

Built-in commands:
- `exit` - Quit REPL
- `help` - Show commands
- `vars` - Show current variables
- `clear` - Clear terminal

Multi-line support for blocks:

```yo
yo> check x > 5 {
...   say "big"
... } else {
...   say "small"
... }
```

## Roadmap

- Functions
- Arrays & objects
- Better diagnostics
- Playground website