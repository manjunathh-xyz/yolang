# Installation

Kexra requires Node.js and can be installed via npm.

## Requirements

- Node.js version 14 or higher
- npm (comes with Node.js)

## Global Installation

Install Kexra globally to use it from anywhere:

```bash
npm install -g kexra
```

This makes the `kex` command available in your terminal.

## Local Installation

For development or local use:

```bash
git clone https://github.com/manjunathh-xyz/kexra.git
cd kexra
npm install
npm run build
```

Then run locally:

```bash
node dist/cli.js run yourfile.kx
```

## Verification

After installation, verify it works:

```bash
kex version
```

You should see:

```
Kexra v0.4.2
```

## Troubleshooting

### Command not found

If `kex` is not recognized:

- Ensure npm global bin directory is in your PATH
- Try `npx kex` instead
- Reinstall: `npm install -g kexra`

### Permission issues

On some systems, you may need to use `sudo`:

```bash
sudo npm install -g kexra
```

## Next Steps

Once installed, try [getting started](getting-started.md) with your first program.