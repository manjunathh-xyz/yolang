# CLI

The Command-Line Interface (CLI) provides commands to run Kexra programs, start the REPL, and get help.

## Installation

First, install Kexra globally:

```bash
npm install -g kexra
```

This makes the `kex` command available in your terminal.

## Commands

### kex run <file>

Execute a Kexra file:

```bash
kex run hello.kx
```

Example output:

```
🚀 Kexra v0.4.1
Running: hello.kx
──────────────────────────
Hello, Kexra!
```

### kex repl

Start the interactive REPL:

```bash
kex repl
```

See the [REPL documentation](repl.md) for details.

### kex version

Show the current version:

```bash
kex version
```

Output:
```
Kexra v0.4.1
```

### kex help

Show help information:

```bash
kex help
```

Output:
```
Kexra v0.4.1

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

Short forms are available:

- `kex -v` → `kex version`
- `kex -h` → `kex help`

## File Extensions

Kexra files typically use the `.kx` extension, though any extension works:

- `program.kx`
- `script.kx`
- `hello.kx`

## Exit Codes

The CLI returns different exit codes:

- `0`: Success
- `1`: Error (syntax error, runtime error, file not found)

## Error Handling

If you try to run a non-existent file:

```bash
kex run nonexistent.kx
```

```
❌ CliError: Could not read file 'nonexistent.kx'
```

## Examples

### Running Examples

The repository includes example files:

```bash
# From the repository root
kex run examples/hello.kx
kex run examples/test.kx
```

### Creating and Running a Program

1. Create `myprogram.kx`:

```kx
say "My first Kexra program!"
set x = 42
say "The answer is: " + x
```

2. Run it:

```bash
kex run myprogram.kx
```

## Advanced Usage

### Piping Input

You can pipe code to the REPL:

```bash
echo 'set x = 10
say x' | kex repl
```

### Building from Source

For development:

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
node dist/cli.js run examples/hello.kx
```

## Troubleshooting

### Command not found

If `kex` is not recognized:

- Ensure npm global bin directory is in your PATH
- Try `npx kex` instead
- Reinstall: `npm install -g kexra`

### Permission issues

On some systems, you may need to adjust permissions or use sudo for global installation.

## Next Steps

Now that you know how to use the CLI, explore the [syntax](syntax.md) to start writing programs.