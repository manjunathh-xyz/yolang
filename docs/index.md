# Kexra Documentation

Welcome to the official documentation for Kexra, a simple and powerful scripting language designed for learning and rapid development.

## What is Kexra?

Kexra is an interpreted scripting language that emphasizes clarity, simplicity, and educational value. Built with TypeScript and running on Node.js, it provides a clean syntax that's easy to learn while teaching fundamental programming concepts.

## Philosophy

Kexra follows these core principles:

- **Clarity First**: Syntax that reads like natural language
- **Educational**: Designed to teach programming concepts effectively
- **Minimal**: Focus on essential features without unnecessary complexity
- **Accessible**: Easy to install, run, and contribute to

## Who is Kexra For?

- **Beginners** learning programming for the first time
- **Students** studying language design and implementation
- **Developers** exploring interpreted languages
- **Educators** looking for simple examples to teach concepts

## What Kexra is NOT

Kexra is not a production-ready language for large-scale applications. It's designed for:

- Learning and experimentation
- Small scripts and automation
- Understanding language internals
- Prototyping ideas

## Learning Path

1. **[Getting Started](getting-started.md)** - Your first Kexra program
2. **[Installation](installation.md)** - How to install Kexra
3. **[Language Basics](language-basics.md)** - Core concepts
4. **[Variables](variables.md)** - Working with data
5. **[Functions](functions.md)** - Reusable code blocks
6. **[Control Flow](control-flow.md)** - Making decisions and loops
7. **[REPL](repl.md)** - Interactive development
8. **[CLI](cli.md)** - Command-line interface
9. **[Kexra Runtime](runtime.md)** - Understanding the runtime
10. **[Kexra Studio](studio.md)** - Web-based IDE
11. **[Errors](errors.md)** - Understanding and fixing errors

## Examples

Here's a simple Kexra program:

```kx
fn greet(name) {
  return "Hello, " + name + "!"
}

say greet("World")
```

This defines a function and calls it, outputting "Hello, World!".

## Project Status

Kexra v0.6.0 introduces the Kexra Runtime and Kexra Studio web IDE. The language now supports booleans, logical operators, for-loops with ranges, break/continue, and nil-safe access.

See the [roadmap](roadmap.md) for upcoming features.

## Community

- [GitHub Repository](https://github.com/manjunathh-xyz/kexra)
- [Issues](https://github.com/manjunathh-xyz/kexra/issues)
- [Discussions](https://github.com/manjunathh-xyz/kexra/discussions)

---

Built with ❤️ using TypeScript