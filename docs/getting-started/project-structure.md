# Project Structure

Organize Kexra projects with a standard layout for code, packages, and configuration to keep projects maintainable.

## Why this exists

Consistent structure helps manage growing projects, separates code from dependencies, and follows community conventions.

## How it works

Projects use `kexra.json` for metadata and `packages/` for local dependencies. Source files go in project root or subdirectories.

## Examples

```
my-project/
├── kexra.json
├── main.kx
├── utils.kx
└── packages/
    └── my-lib/
        ├── kexra.json
        └── src/
            └── index.kx
```

## Common mistakes

- Mixing source and package code
- Forgetting to update kexra.json
- Not using relative paths correctly

## Related topics

- [Modules & Packages](modules-packages.md)
- [Package Authoring](package-authoring.md)
- [Running Files](running-files.md)
