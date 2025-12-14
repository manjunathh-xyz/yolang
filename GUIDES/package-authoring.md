# Package Authoring Guide

This guide explains how to create, structure, and publish your own Kexra packages.

## Package Structure

A typical Kexra package has this structure:

```
my-package/
├── kexra.json
├── src/
│   └── index.kx
```

## Manifest (kexra.json)

Every package must have a `kexra.json` file:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "dependencies": {
    "other-package": "^1.0.0"
  }
}
```

- `name`: Unique package name (lowercase, hyphens allowed)
- `version`: Semver version
- `dependencies`: Optional, packages this package needs

## Writing Package Code

Create `src/index.kx` with your package code:

```kx
# Define functions
fn add(a, b) {
  return a + b
}

# Define constants
set pi = 3.14159

# Export everything automatically
```

**Important**: Everything defined at the top level is exported automatically. No explicit export statements needed.

## Using Your Package

In another project:

```kx
use my-package {
  add,
  pi
}

say add(2, 3)  # 5
say pi         # 3.14159
```

## Versioning

- Follow semantic versioning: `MAJOR.MINOR.PATCH`
- Increment MAJOR for breaking changes
- Increment MINOR for new features
- Increment PATCH for bug fixes

## Publishing

1. Ensure your package works locally
2. Update version in `kexra.json`
3. Share your package directory or repository

## Best Practices

- Keep packages focused on a single purpose
- Avoid side effects during import
- Use clear, descriptive names
- Document your functions with comments
- Test your package thoroughly
- Avoid global state mutations

## Example Package

See the official `math` module for a complete example.
