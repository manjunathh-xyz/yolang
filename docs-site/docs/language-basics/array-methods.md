# Array Methods

Arrays provide methods for collection manipulation.

## Why this exists

Array methods enable efficient operations on collections of data.

## How it works

Built-in functions like `map`, `filter`, `len` work on arrays.

## Examples

```kx
set numbers = [1, 2, 3]
say len(numbers)  # 3
set doubled = map(numbers, fn(x) { return x * 2 })
```

## Common mistakes

- Passing wrong types to array methods
- Forgetting arrays are 0-indexed

## Related topics

- [Arrays](arrays.md)
- [Standard Library](standard-library.md)
