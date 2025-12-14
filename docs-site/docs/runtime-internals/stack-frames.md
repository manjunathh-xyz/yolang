# Stack Frames

Runtime call stack management for function execution.

## Why this exists

Stack frames enable proper function call nesting and error traceback.

## How it works

Each function call creates a stack frame with location information for debugging.

## Examples

When a function is called:

1. Create new stack frame
2. Push to call stack
3. Execute function
4. Pop frame on return

## Common mistakes

- Not understanding stack overflow limits
- Assuming stack frames persist after return

## Related topics

- [Execution Lifecycle](execution-lifecycle.md)
- [Error Propagation](../error-handling/error-propagation.md)
- [Async Call Stacks](../async-execution-model/async-call-stacks.md)
