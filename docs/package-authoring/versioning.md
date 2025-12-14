# Versioning

Managing package versions using semantic versioning.

## Why this exists

Versioning ensures compatibility and allows users to specify acceptable version ranges.

## How it works

Use MAJOR.MINOR.PATCH format. Increment based on the type of changes made.

## Examples

- `1.0.0` → `1.1.0`: New features (minor)
- `1.0.0` → `2.0.0`: Breaking changes (major)
- `1.0.0` → `1.0.1`: Bug fixes (patch)

## Common mistakes

- Not incrementing versions on changes
- Breaking changes without major version bump
- Incompatible version ranges

## Related topics

- [Kexra.json Spec](../modules-packages/kexra.json-spec.md)
- [Dependency Rules](../modules-packages/dependency-rules.md)
- [Publishing via PR](publishing-via-pr.md)
