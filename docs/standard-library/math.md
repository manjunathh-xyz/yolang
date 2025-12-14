# Math

Built-in mathematical functions and constants.

## Why this exists

Math operations are fundamental to many programs, so they're available without external dependencies.

## How it works

Math functions operate on numbers and return numeric results. Constants like pi and e are available.

## Examples

```kx
use math { pi, e, sin, cos, sqrt }

set circleArea = pi * radius * radius
set hypotenuse = sqrt(a*a + b*b)
set angle = sin(theta)
```

## Common mistakes

- Forgetting to import math functions
- Using degrees instead of radians for trig functions

## Related topics

- [Math Extra](math-extra.md)
- [Numbers](../language-basics/numbers.md)
- [Number Operations](../language-basics/number-operations.md)
