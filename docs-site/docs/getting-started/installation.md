# Installation

Kexra requires Node.js to run. The installation process sets up the Kexra CLI globally on your system.

## Why this exists

Installation provides the `kex` command globally, allowing you to run Kexra programs from anywhere on your system.

## How it works

The installation uses npm to install the Kexra package globally, making the `kex` command available in your PATH.

## Examples

```bash
# Install Kexra globally
npm install -g kexra

# Verify installation
kex --version
```

## Common mistakes

- Installing without the `-g` flag (won't make the command global)
- Not having Node.js installed first

## Related topics

- [First Program](first-program.md)
- [REPL Usage](repl-usage.md)
- [Running Files](running-files.md)
