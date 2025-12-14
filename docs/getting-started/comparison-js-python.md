# Comparison with JS/Python

Kexra shares concepts with JavaScript and Python but differs in syntax, execution model, and scope to prioritize simplicity.

## Why this exists

Understanding differences helps users coming from other languages adapt their mental models and avoid confusion.

## How it works

Kexra borrows familiar ideas but simplifies them: no semicolons, deterministic execution, minimal syntax.

## Examples

| Feature     | Kexra                           | JavaScript                            | Python                        |
| ----------- | ------------------------------- | ------------------------------------- | ----------------------------- |
| Hello World | `say "Hello"`                   | `console.log("Hello")`                | `print("Hello")`              |
| Variables   | `set x = 5`                     | `let x = 5`                           | `x = 5`                       |
| Functions   | `fn add(a, b) { return a + b }` | `function add(a, b) { return a + b }` | `def add(a, b): return a + b` |

## Common mistakes

- Applying JS/Python patterns directly
- Expecting semicolons or indentation-based blocks
- Assuming similar performance characteristics

## Related topics

- [Why Kexra Exists](why-kexra-exists.md)
- [Language Philosophy](language-philosophy.md)
- [Language Basics](language-basics.md)
