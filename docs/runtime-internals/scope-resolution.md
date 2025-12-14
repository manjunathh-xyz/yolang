# Scope Resolution

How variable lookup and scoping works at runtime.

## Why this exists

Proper scoping prevents variable conflicts and enables modular code.

## How it works

Variables are resolved by searching the environment stack from top to bottom.

## Examples

- Local variables shadow globals
- Function parameters create new scope
- Closures capture outer environments

## Common mistakes

- Assuming dynamic scoping
- Variable hoisting expectations
- Not understanding closure capture

## Related topics

- [Variables](../language-basics/variables.md)
- [Functions](../functions/defining-functions.md)
- [Execution Lifecycle](execution-lifecycle.md)
