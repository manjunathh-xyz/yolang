# Time Helpers

Built-in functions for working with time and dates.

## Why this exists

Time-related operations are common in applications, from logging to scheduling.

## How it works

Time functions provide current timestamps and sleep functionality for delays.

## Examples

```kx
# Get current timestamp
set start = now()

# Sleep for 1 second (when async is implemented)
sleep(1000)

set end = now()
set duration = end - start
say "Operation took " + duration + "ms"
```

## Common mistakes

- Using now() for measuring time without considering async
- Blocking the event loop with sleep in non-async code

## Related topics

- [Async Execution Model](../async-execution-model/event-loop-model.md)
- [Numbers](../language-basics/numbers.md)
- [Built-in Functions](../tooling-cli/kex-command.md)
