# Package Philosophy

Kexra packages are self-contained, folder-based modules that promote simplicity and local development.

## Why this exists

Packages enable code reuse and organization without complex tooling or registries.

## How it works

Each package is a directory with code and metadata. Packages can depend on others, forming a local dependency graph.

## Examples

```
my-app/
  kexra.json
  src/
    main.kx
  packages/
    utils/
      kexra.json
      src/
        helpers.kx
```

## Common mistakes

- Treating packages like monolithic libraries
- Not understanding local-first approach

## Related topics

- [Folder-Based Packages](folder-based-packages.md)
- [Kexra.json Spec](kexra.json-spec.md)
- [Import System](import-system.md)
