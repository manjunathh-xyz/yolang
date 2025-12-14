# For Loops

For loops iterate over each item in a collection, executing a block for each.

## Why this exists

For loops simplify processing collections like arrays or objects without manual indexing.

## How it works

Use `for` followed by a variable name, `in`, the collection, then the block. The variable takes the value of each item in turn.

## Examples

Iterating over an array:

```
set numbers = [1, 2, 3, 4, 5]
for num in numbers {
  print(num * 2)
}
```

Iterating over an object (keys):

```
set person = {name: "Alice", age: 30}
for key in person {
  print(key + ": " + person[key])
}
```

## Common mistakes

- Attempting to modify the collection during iteration.
- Using the loop variable outside the loop (it may not be defined).
- Forgetting that `for` iterates over keys for objects, not values.

## Related topics

- [Arrays](../language-basics/arrays.md)
- [Objects](../language-basics/objects.md)
- [Loops](loops.md)
