# CLI Flags

Command-line options for the kex command.

## Why this exists

Flags provide shortcuts and additional options for common operations.

## How it works

Flags can be used instead of subcommands for brevity.

## Examples

```bash
# Short for 'kex help'
kex -h

# Short for 'kex version'
kex -v

# Flags can be combined with subcommands
kex run --verbose my-file.kx
```

## Common mistakes

- Using flags that don't exist
- Confusing flags with subcommands

## Related topics

- [Kex Command](kex-command.md)
- [Kex Run](kex-run.md)
- [Error Output](error-output.md)
