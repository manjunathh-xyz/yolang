# Kexra Runtime Model

## Execution Model

Kexra executes code in a single-threaded, deterministic manner with support for async operations.

## Stack Frames

Each function call creates a stack frame containing:

- Local variables
- Parameters
- Return address
- Source location

## Memory Management

Values are reference-counted. No manual memory management required.

## Determinism

Given the same input, Kexra produces identical output. Randomness is seeded.

## Profiling

Runtime supports profiling with execution timing and call counts.

## Error Handling

Errors include full stack traces and source locations.
