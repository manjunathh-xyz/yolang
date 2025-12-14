# 🚀 Kexra

> A playful, beginner-friendly scripting language built with TypeScript

**v0.4.1 - Documentation Unification Release** ✨

[![npm version](https://img.shields.io/npm/v/kexra.svg)](https://www.npmjs.com/package/kexra)
[![GitHub license](https://img.shields.io/github/license/manjunathh-xyz/kexra)](https://github.com/manjunathh-xyz/kexra/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/manjunathh-xyz/kexra/ci.yml)](https://github.com/manjunathh-xyz/kexra/actions)

Kexra is a simple interpreted scripting language designed for beginners, hobbyists, and anyone interested in language design. It's built with TypeScript and runs on Node.js, offering a fun way to explore programming language concepts.

## ✨ Features

- 🎯 **Easy Syntax**: Inspired by casual developer English
- ⚡ **Interpreted**: Instant feedback with no compilation step
- 🖥️ **Interactive REPL**: Experiment in real-time
- 🔧 **Extensible**: Open-source and built for learning
- 📚 **Educational**: Perfect for understanding language internals
- 🧮 **Functions**: User-defined functions with parameters and return values

## 📦 Installation

### From npm (Recommended)

```bash
npm install -g kexra
```

### From Source

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
```

## 🚀 Quick Start

### Hello World

Create a file `hello.kx`:

```kx
say "Hello, Kexra!"
```

Run it:

```bash
kex run hello.kx
```

Output:
```
🚀 Kexra v0.4.1
Running: hello.kx
────────────────────────
Hello, Kexra!
```

### Interactive REPL

```bash
kex repl
```

```
🎧 Kexra REPL v0.4.1
Type 'help' for commands, 'exit' to quit
kex> set x = 42
kex> say x
42
kex> exit
Goodbye!
```

## 📚 Documentation

Full documentation is available at:
https://kexra.js.org/docs

The docs include:
- Complete language reference
- Tutorials and examples
- REPL guide
- Error handling
- CLI reference

## 📖 Syntax

### Variables

```yo
set name = "Yolang"
set age = 25
```

### Output

```yo
say "Hello World"
say name + " is " + age + " years old"
```

### Math

```yo
set result = (10 + 5) * 2 / 3
say result
```

### Conditionals

```yo
check age >= 18 {
  say "Adult"
} else {
  say "Minor"
}
```

### Loops

```yo
set i = 0
loop i < 5 {
  say i
  set i = i + 1
}
```

### Functions

```kx
fn add(a, b) {
  return a + b
}

set result = add(2, 3)
say result  # Outputs: 5
```

### Comments

```kx
# This is a comment
set x = 10  # Inline comment
```

## 🛠️ CLI Reference

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `kex run <file>` | Execute a Kexra file | `kex run script.kx` |
| `kex repl` | Start interactive REPL | `kex repl` |
| `kex version` | Show version | `kex version` |
| `kex help` | Show help | `kex help` |

### Aliases

- `yo -v` → `yo version`
- `yo -h` → `yo help`

## 🎮 REPL Features

The REPL provides an interactive environment with:

- **Persistent Variables**: Variables persist across commands
- **Multi-line Support**: Automatic handling of `{ ... }` blocks
- **Built-in Commands**:
  - `help` - Show available commands
  - `vars` - Display current variables
  - `clear` - Clear the terminal
  - `exit` - Quit the REPL

### Multi-line Example

```
yo> check x > 10 {
...   say "Big number"
... } else {
...   say "Small number"
... }
```

## 📚 Examples

Check the `examples/` directory:

- `hello.kx` - Basic greeting
- `test.kx` - Comprehensive syntax demo
- `error.kx` - Error handling example

Run examples:

```bash
kex run examples/hello.kx
kex run examples/test.kx
```

## 🏗️ Architecture

Yolang consists of three main components:

1. **Lexer** (`src/lexer/`): Tokenizes source code
2. **Parser** (`src/parser/`): Builds AST from tokens
3. **Interpreter** (`src/runtime/`): Executes the AST

```
Source Code → Lexer → Tokens → Parser → AST → Interpreter → Output
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
npm test
```

### Project Structure

```
kexra/
├── src/
│   ├── cli.ts           # Command-line interface
│   ├── repl/            # REPL implementation
│   ├── lexer/           # Lexical analysis
│   ├── parser/          # Syntax parsing
│   ├── runtime/         # Interpretation
│   └── errors/          # Error handling
├── examples/            # Sample programs
├── dist/                # Compiled JavaScript
└── package.json         # Dependencies and scripts
```

## 🐛 Error Handling

Yolang provides friendly error messages:

```bash
kex run broken.kx
```

```
❌ SyntaxError
File: broken.kx
Line: 3

  set x == 10
        ^^

Hint: Use "=" for assignment, not "=="
```

## 📚 Documentation

Full documentation is available at:
https://github.com/manjunathh-xyz/kexra/tree/main/docs

- [Getting Started](docs/getting-started.md) - Installation and first program
- [Syntax](docs/syntax.md) - Basic grammar and structure
- [Variables](docs/variables.md) - Working with data
- [Functions](docs/functions.md) - Defining and calling functions
- [Control Flow](docs/control-flow.md) - Conditionals and loops
- [REPL](docs/repl.md) - Interactive development
- [CLI](docs/cli.md) - Command-line interface
- [Errors](docs/errors.md) - Understanding error messages

## 🛣️ Roadmap

- [x] Functions and procedures
- [ ] Arrays and objects
- [ ] File I/O operations
- [ ] Standard library
- [ ] Web playground
- [ ] VS Code extension
- [ ] Package manager

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using TypeScript
- Inspired by the joy of programming
- Thanks to the open-source community

## Website

Official website:  
https://manjunathh-xyz.github.io/kexra/

## Credits

- Manjunath H ([@manjunathh-xyz](https://github.com/manjunathh-xyz))
- Ramkrishna ([@ramkrishna-xyz](https://github.com/ramkrishna-xyz))

---

**Ready to build your own language?** Kexra is a great starting point! 🌟