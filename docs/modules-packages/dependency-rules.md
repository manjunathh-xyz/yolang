# Dependency Rules

Rules governing how packages can depend on each other.

## Why this exists

Dependency rules prevent circular dependencies and ensure a clean package graph.

## How it works

Packages can depend on other packages, but circular dependencies are not allowed. Dependencies are resolved depth-first.

## Examples

```
Valid:
A -> B -> C
A -> C

Invalid:
A -> B -> A (circular)
```

## Common mistakes

- Creating circular dependencies
- Depending on unstable packages
- Not specifying dependency versions

## Related topics

- [Package Resolution](package-resolution.md)
- [Versioning](versioning.md)
- [Package Philosophy](package-philosophy.md)
