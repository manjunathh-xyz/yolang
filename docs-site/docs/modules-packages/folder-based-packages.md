# Folder-Based Packages

Packages are organized as directories containing source code and metadata.

## Why this exists

Folder structure provides a simple, filesystem-based approach to package management without needing special tools.

## How it works

A package directory contains a kexra.json file and a src/ directory with .kx files. The package name is the directory name.

## Examples

```
packages/
  math-utils/
    kexra.json
    src/
      arithmetic.kx
      geometry.kx
  string-helpers/
    kexra.json
    src/
      format.kx
```

## Common mistakes

- Not following the expected directory structure
- Naming conflicts between packages

## Related topics

- [Package Philosophy](package-philosophy.md)
- [Kexra.json Spec](kexra.json-spec.md)
- [Package Resolution](package-resolution.md)
