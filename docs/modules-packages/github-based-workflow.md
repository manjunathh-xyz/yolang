# GitHub-Based Workflow

Packages can be published and installed from GitHub repositories.

## Why this exists

GitHub provides a simple, decentralized way to share and distribute packages without a central registry.

## How it works

Packages are published by pushing to GitHub. Others install using github:user/repo syntax, which downloads and installs the package.

## Examples

```bash
# Install from GitHub
kex install github:username/math-utils

# In kexra.json
{
  "dependencies": {
    "math-utils": "github:username/math-utils"
  }
}
```

## Common mistakes

- Not tagging releases properly
- Publishing unstable code
- Not including kexra.json in repository

## Related topics

- [Package Authoring](../package-authoring/creating-a-package.md)
- [Kexra.json Spec](kexra.json-spec.md)
- [Versioning](versioning.md)
