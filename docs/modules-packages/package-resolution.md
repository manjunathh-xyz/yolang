# Package Resolution

Kexra resolves package dependencies by searching local directories and installed modules.

## Why this exists

Package resolution ensures that imports can find the correct package versions and locations.

## How it works

Packages are resolved in order: local packages/, then kex_modules/, then built-in modules. Version constraints are checked during installation.

## Examples

```
project/
  packages/
    local-utils/
      src/index.kx
  kex_modules/
    external-lib/
      src/index.kx
  src/main.kx  # can import both local-utils and external-lib
```

## Common mistakes

- Not installing dependencies before running
- Version conflicts between packages
- Incorrect package directory structure

## Related topics

- [Import System](import-system.md)
- [Kexra.json Spec](kexra.json-spec.md)
- [Versioning](versioning.md)
