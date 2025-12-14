# Kex Command

The main command-line interface for Kexra.

## Why this exists

The kex command provides access to all Kexra functionality from the terminal.

## How it works

Kex accepts subcommands and arguments. Use `kex help` to see all available commands.

## Examples

```bash
# Show help
kex help

# Show version
kex version

# Start REPL
kex repl

# Run a file
kex run hello.kx
```

## Common mistakes

- Running kex without arguments
- Using incorrect subcommand syntax

## Related topics

- [REPL Usage](../getting-started/repl-usage.md)
- [Running Files](../getting-started/running-files.md)
- [CLI Flags](cli-flags.md)
