# Kexra.json Spec

The kexra.json file defines package metadata and dependencies.

## Why this exists

Package metadata enables dependency resolution and provides information about the package.

## How it works

kexra.json is a JSON file in the package root with fields for name, version, description, author, license, and dependencies.

## Examples

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "A useful package",
  "author": "developer@example.com",
  "license": "MIT",
  "dependencies": {
    "math-utils": "1.0.0",
    "string-helpers": "^2.0.0"
  }
}
```

## Common mistakes

- Using invalid JSON syntax
- Not specifying required fields
- Incorrect dependency version formats

## Related topics

- [Folder-Based Packages](folder-based-packages.md)
- [Package Resolution](package-resolution.md)
- [Versioning](versioning.md)
