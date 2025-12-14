# Versioning

Package versions follow semantic versioning for compatibility and dependency management.

## Why this exists

Versioning ensures that package updates don't break existing code and allows specifying compatible version ranges.

## How it works

Versions use MAJOR.MINOR.PATCH format. Dependencies can specify exact versions or ranges using ^ for compatible updates.

## Examples

```json
{
  "dependencies": {
    "utils": "1.2.3", // Exact version
    "math": "^2.0.0", // Any 2.x.x version
    "web": "~1.5.0" // Any 1.5.x version
  }
}
```

## Common mistakes

- Not updating version numbers on breaking changes
- Using overly restrictive version ranges
- Not testing with different dependency versions

## Related topics

- [Kexra.json Spec](kexra.json-spec.md)
- [Package Resolution](package-resolution.md)
- [Dependency Rules](dependency-rules.md)
