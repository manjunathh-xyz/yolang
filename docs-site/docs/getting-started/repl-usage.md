# REPL Usage

The Read-Eval-Print Loop (REPL) allows interactive execution of Kexra code, perfect for experimentation and testing snippets.

## Why this exists

REPL provides immediate feedback without creating files, enabling quick testing of ideas and learning through trial and error.

## How it works

Start REPL with `kex repl`, then enter statements or expressions. Each line is evaluated immediately, with results displayed.

## Examples

```bash
$ kex repl
> say "Hello"
Hello
> set x = 42
> say x
42
> x + 8
50
```

## Common mistakes

- Expecting multi-line statements (REPL evaluates line by line)
- Forgetting semicolons aren't needed (Kexra uses newlines)
- Using file-specific features like imports

## Related topics

- [First Program](first-program.md)
- [Running Files](running-files.md)
- [Tooling & CLI](tooling-cli.md)
