# Math Extra

Extended mathematical utilities built on the core math module.

## Why this exists

While core math provides basic functions, math-extra adds commonly needed utilities.

## How it works

Math-extra wraps and extends the built-in math functions with additional convenience functions.

## Examples

```kx
use math-extra { sin, cos, e }

set result = sin(pi/2)  # 1
set exponential = e ^ 2
```

## Common mistakes

- Confusing math-extra with built-in math
- Not checking which functions are in which module

## Related topics

- [Math](math.md)
- [Package Authoring](../package-authoring/creating-a-package.md)
- [Import System](../modules-packages/import-system.md)
