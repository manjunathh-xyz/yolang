# Blocking vs Non-Blocking

Operations can be blocking or non-blocking, affecting program responsiveness.

## Why this exists

Non-blocking operations prevent programs from freezing during I/O, enabling responsive applications.

## How it works

Blocking operations halt execution until complete. Non-blocking operations return immediately and use callbacks or await for results.

## Examples

```kx
# Blocking file read (synchronous)
set content = readFileSync("data.txt")  # Blocks until file is read
say "File loaded"

# Non-blocking file read (asynchronous)
set content = await readFile("data.txt")  # Doesn't block
say "File loading started"
# ... other work can happen here
say "File loaded: " + content
```

## Common mistakes

- Using blocking operations in responsive applications
- Not handling the asynchronous nature of non-blocking calls

## Related topics

- [Event Loop Model](event-loop-model.md)
- [Await Semantics](await-semantics.md)
- [Async Functions](../functions/async-functions.md)
