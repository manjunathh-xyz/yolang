# Array Helpers

Built-in functions for working with arrays.

## Why this exists

Arrays are fundamental data structures, and helper functions make common operations easier.

## How it works

Array helpers like map and filter take arrays and functions, applying the function to each element.

## Examples

```kx
set numbers = [1, 2, 3, 4, 5]

# Map: transform each element
set doubled = map(numbers, fn(x) { return x * 2 })  # [2, 4, 6, 8, 10]

# Filter: keep elements that match condition
set evens = filter(numbers, fn(x) { return x % 2 == 0 })  # [2, 4]

# Length
set count = len(numbers)  # 5
```

## Common mistakes

- Passing wrong argument types to helpers
- Forgetting that map/filter return new arrays

## Related topics

- [Arrays](../language-basics/arrays.md)
- [Functions](../functions/defining-functions.md)
- [Type Helpers](type-helpers.md)
