# Creating a Package

Steps to create a new Kexra package.

## Why this exists

Packages enable code reuse and sharing within the Kexra ecosystem.

## How it works

Create a directory with kexra.json and source files, following the standard package structure.

## Examples

```bash
# Create package directory
mkdir my-package
cd my-package

# Initialize kexra.json
kex init

# Edit kexra.json with package details
# Create src/index.kx with your code
```

## Common mistakes

- Not following the required directory structure
- Missing kexra.json file
- Not testing the package before publishing

## Related topics

- [Folder Layout](folder-layout.md)
- [Kexra.json Spec](../modules-packages/kexra.json-spec.md)
- [Publishing via PR](publishing-via-pr.md)
