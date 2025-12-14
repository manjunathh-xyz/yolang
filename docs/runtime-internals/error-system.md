# Error System

Runtime error handling and propagation mechanisms.

## Why this exists

The error system provides structured failure handling throughout execution.

## How it works

Errors are objects with type, message, and location information that propagate up the stack.

## Examples

Error types:

- RuntimeError: Execution failures
- SyntaxError: Parse errors
- CliError: Command-line issues

## Common mistakes

- Catching errors too broadly
- Not preserving error context
- Silent error swallowing

## Related topics

- [Error Propagation](../error-handling/error-propagation.md)
- [Try/Catch/Finally](../error-handling/try-catch-finally.md)
- [Stack Frames](stack-frames.md)
