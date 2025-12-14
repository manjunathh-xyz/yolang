# Kex Install

Install packages and dependencies.

## Why this exists

Package installation enables using external libraries and managing project dependencies.

## How it works

`kex install` reads kexra.json and installs listed dependencies into kex_modules/.

## Examples

```bash
# Install all dependencies
kex install

# Install specific package
kex install github:user/package

# Install local package
kex install ../local-package
```

## Common mistakes

- Installing packages without kexra.json
- Not updating dependencies after changes
- Installing incompatible versions

## Related topics

- [Package Resolution](../modules-packages/package-resolution.md)
- [Kexra.json Spec](../modules-packages/kexra.json-spec.md)
- [GitHub-Based Workflow](../modules-packages/github-based-workflow.md)
