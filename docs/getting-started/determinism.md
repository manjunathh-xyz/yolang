# Determinism

Kexra programs produce the same output for the same input, ensuring predictable behavior.

## Why this exists

Determinism makes programs reliable and easier to debug, as results don't depend on external factors.

## How it works

The runtime executes statements in order without random elements or external dependencies affecting outcomes.

## Examples

```kx
say 2 + 3  # Always outputs 5
```

## Common mistakes

- Expecting random behavior
- Assuming external factors influence execution

## Related topics

- [Language Philosophy](language-philosophy.md)
- [Async & Execution Model](async-execution.md)
