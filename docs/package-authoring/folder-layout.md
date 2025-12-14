# Folder Layout

Standard directory structure for Kexra packages.

## Why this exists

Consistent structure makes packages predictable and easy to understand.

## How it works

Packages follow a simple layout with metadata and source code separated.

## Examples

```
my-package/
├── kexra.json          # Package metadata
├── src/
│   └── index.kx        # Main package code
├── README.md           # Documentation
└── LICENSE             # License file
```

## Common mistakes

- Putting source files in wrong locations
- Missing required files
- Inconsistent naming conventions

## Related topics

- [Creating a Package](creating-a-package.md)
- [Kexra.json Spec](../modules-packages/kexra.json-spec.md)
- [Writing Docs](writing-docs.md)
