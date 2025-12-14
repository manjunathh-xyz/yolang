# Kexra Runtime

The Kexra Runtime (`kxr`) is the core execution engine for Kexra programs. It provides a unified interface for running Kexra code across different environments.

## Overview

The runtime manages:

- **Value System**: Unified representation of all data types
- **Call Stack**: Function call tracking and error reporting
- **Environment**: Variable scoping and state management
- **Built-ins**: Standard library functions

## Architecture

```
Source Code (.kx)
    ↓
Lexer → Parser → AST
    ↓
Kexra Runtime
    ↓
Interpreter → Result
```

## API

The runtime provides a stable API for tools like the CLI, REPL, and Kexra Studio:

```typescript
class KexraRuntime {
  runFile(path: string): RuntimeResult
  eval(source: string): RuntimeResult
  registerBuiltin(name: string, fn: RuntimeFn): void
  getStackTrace(): StackFrame[]
}
```

## Value System

All data in Kexra uses a unified `Value` type supporting:

- Numbers: `42`, `3.14`
- Strings: `"hello"`
- Booleans: `true`, `false`
- Arrays: `[1, 2, 3]`
- Objects: `{name: "Alice", age: 30}`
- Functions: User-defined and built-in
- Null: `null`

## Built-in Functions

| Function | Description |
|----------|-------------|
| `len(x)` | Length of string or array |
| `type(x)` | Type of value |
| `print(x)` | Print value (alias for `say`) |
| `keys(obj)` | Object keys |
| `values(obj)` | Object values |

## Error Handling

Runtime errors include:

- Type mismatches
- Undefined variables/functions
- Index out of bounds
- Invalid operations

Use `--debug` flag for stack traces.

## Flags

- `--debug`: Show detailed error information
- `--trace`: Enable execution tracing