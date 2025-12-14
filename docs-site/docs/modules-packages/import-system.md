# Import System

The use statement imports functions and values from packages.

## Why this exists

Imports allow code to access functionality from other packages without global namespace pollution.

## How it works

Use specifies a package name and optionally a list of items to import. Imported items become available in the current scope.

## Examples

```kx
# Import specific items
use math { pi, sin, cos }
say sin(pi/2)  # 1

# Import all from package
use string-utils { * }
set result = capitalize("hello")

# Import with alias
use complex-math { add as complexAdd }
set sum = complexAdd(a, b)
```

## Common mistakes

- Forgetting to import required functions
- Import conflicts between packages
- Using incorrect package names

## Related topics

- [Package Resolution](package-resolution.md)
- [Folder-Based Packages](folder-based-packages.md)
- [Package Philosophy](package-philosophy.md)
