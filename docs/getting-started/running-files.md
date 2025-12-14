# Running Files

Execute Kexra scripts from the command line using the `kex run` command, which interprets and runs your code.

## Why this exists

Running files allows development of reusable scripts and programs, moving beyond one-off REPL experiments.

## How it works

The `kex run <filename.kx>` command tokenizes, parses, and interprets the file, executing all statements in order.

## Examples

```bash
# Run a simple script
kex run hello.kx

# With debug output
kex run --debug script.kx

# Run from different directory
kex run ./scripts/myprogram.kx
```

## Common mistakes

- Running files without `.kx` extension
- File not found errors due to wrong path
- Syntax errors preventing execution

## Related topics

- [First Program](first-program.md)
- [REPL Usage](repl-usage.md)
- [Project Structure](project-structure.md)
