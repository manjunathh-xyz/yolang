# Kex Run

Execute Kexra source files.

## Why this exists

Running files allows executing complete Kexra programs from the command line.

## How it works

`kex run` takes a file path, reads the source, and executes it using the Kexra runtime.

## Examples

```bash
# Run a specific file
kex run my-program.kx

# Run with relative path
kex run src/main.kx

# Run from different directory
kex run ../other-project/app.kx
```

## Common mistakes

- Running files with syntax errors
- Not having proper file permissions
- Using wrong file extensions

## Related topics

- [Running Files](../getting-started/running-files.md)
- [Kex Command](kex-command.md)
- [Error Output](error-output.md)
