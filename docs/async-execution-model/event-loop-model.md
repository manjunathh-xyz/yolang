# Event Loop Model

Kexra uses a single-threaded event loop for handling asynchronous operations.

## Why this exists

The event loop enables non-blocking I/O and concurrent operations without the complexity of multi-threading.

## How it works

Asynchronous operations are queued and executed sequentially. The event loop processes one operation at a time, ensuring deterministic execution.

## Examples

```kx
# Async operations queue sequentially
fn asyncTask(id) {
  say "Starting task " + id
  await delay(100)
  say "Completed task " + id
}

# Tasks run one after another
asyncTask(1)
asyncTask(2)
# Output: Starting task 1, Completed task 1, Starting task 2, Completed task 2
```

## Common mistakes

- Assuming async operations run in parallel
- Not understanding sequential execution order

## Related topics

- [Await Semantics](await-semantics.md)
- [Determinism](../getting-started/determinism.md)
- [Async Call Stacks](async-call-stacks.md)
