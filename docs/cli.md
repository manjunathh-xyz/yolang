# CLI

The Command-Line Interface provides commands to run Kexra programs and access tools.

## Installation

After installing Kexra globally:

```bash
npm install -g kexra
```

The `kex` command becomes available.

## Commands

### kex run <file>

Execute a Kexra file:

```bash
kex run hello.kx
```

Example output:

```
🚀 Kexra v0.4.2
Running: hello.kx
──────────────────────────
Hello, Kexra!
```

### kex repl

Start the interactive REPL:

```bash
kex repl
```

See [REPL documentation](repl.md) for details.

### kex version

Show version information:

```bash
kex version
```

Output:

```
Kexra v0.4.2
```

### kex help

Display help information:

```bash
kex help
```

Output:

```
Kexra v0.4.2

Usage:
  kex run <file.kx>     Run a Kexra file
  kex repl              Start interactive REPL
  kex version           Show version
  kex help              Show help

Aliases:
  kex -h                Same as help
  kex -v                Same as version
```

## Aliases

- `kex -v` → `kex version`
- `kex -h` → `kex help`

## File Extensions

Use `.kx` for Kexra files:

- `program.kx`
- `script.kx`

## Exit Codes

- `0`: Success
- `1`: Error (syntax, runtime, file not found)

## Error Handling

Missing file:

```bash
kex run missing.kx
❌ CliError: Could not read file 'missing.kx'
```

## Examples

### Running Examples

```bash
kex run examples/hello.kx
kex run examples/test.kx
```

### Creating Programs

1. Create `myprogram.kx`:

```kx
say "My program"
set x = 42
say x
```

2. Run it:

```bash
kex run myprogram.kx
```

## Advanced Usage

### Piping to REPL

```bash
echo 'set x = 10
say x' | kex repl
```

### Local Development

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
node dist/cli.js run yourfile.kx
```

## Troubleshooting

### Command not found

- Check PATH includes npm global bin
- Use `npx kex` as alternative
- Reinstall: `npm install -g kexra`

### Permission issues

Use `sudo` on Unix systems:

```bash
sudo npm install -g kexra
```

## Next Steps

Learn about [errors](errors.md) to understand and fix issues.