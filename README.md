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
yo run <file.yo>
```

## Roadmap

- REPL for interactive coding
- Functions and more data types
- Better error diagnostics
- Web playground