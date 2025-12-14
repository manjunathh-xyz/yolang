# Getting Started

This guide will help you install Kexra and run your first program.

## Installation

Kexra requires Node.js (version 14 or higher). You can install it globally using npm:

```bash
npm install -g kexra
```

This makes the `kex` command available in your terminal.

### From Source

If you prefer to build from source:

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
```

Then you can run it locally with:

```bash
node dist/cli.js
```

## Your First Program

Create a file called `hello.kx` with the following content:

```kx
say "Hello, Kexra!"
```

Run it with:

```bash
kex run hello.kx
```

You should see:

```
🚀 Kexra v0.4.1
Running: hello.kx
──────────────────────────
Hello, Kexra!
```

## Using the REPL

Kexra includes an interactive Read-Eval-Print Loop (REPL) for experimenting:

```bash
kex repl
```

```
🎧 Kexra REPL v0.4.1
Type 'help' for commands, 'exit' to quit
kex> set message = "Hello from REPL!"
kex> say message
Hello from REPL!
kex> exit
Goodbye!
```

The REPL is great for testing small snippets and learning the language interactively.

## Next Steps

Now that you have Kexra installed, you can:

- Explore the [syntax](syntax.md) basics
- Learn about [variables](variables.md)
- Try writing [functions](functions.md)

Check out the [examples](../examples/) directory in the repository for more sample programs.