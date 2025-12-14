# Comparison with JS Async

Kexra's async model differs from JavaScript's in simplicity and determinism.

## Why this exists

Understanding the differences helps developers transitioning from JavaScript or working with both languages.

## How it works

Unlike JavaScript's complex Promise/microtask system, Kexra uses a simple event loop with deterministic execution order.

## Examples

```kx
# JavaScript (non-deterministic order possible)
async function jsExample() {
  console.log(1);
  setTimeout(() => console.log(2), 0);
  await Promise.resolve();
  console.log(3);
}
// Output: 1, 3, 2 (or 1, 2, 3 depending on timing)

# Kexra (deterministic)
fn kexraExample() {
  say 1
  schedule(() => say 2, 0)
  await yield()
  say 3
}
# Output: 1, 3, 2 (always in this order)
```

## Common mistakes

- Assuming Kexra async behaves like JavaScript
- Expecting non-deterministic timing behavior

## Related topics

- [Determinism](../getting-started/determinism.md)
- [Event Loop Model](event-loop-model.md)
- [Comparison with JS/Python](../getting-started/comparison-js-python.md)
