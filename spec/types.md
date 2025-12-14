# Kexra Type System

## Dynamic Typing

Kexra uses dynamic typing with optional static type annotations.

## Primitive Types

- **Number**: 64-bit floating point
- **String**: UTF-8 encoded
- **Boolean**: true/false
- **Null**: absence of value
- **Array**: ordered collection
- **Object**: key-value pairs
- **Function**: executable code

## Type Annotations

Type annotations are optional and do not affect runtime behavior.

### Function Signatures

```kx
fn add(a: Number, b: Number): Number {
  return a + b
}
```

### Parameter Types

Parameters can have type annotations:

```kx
fn process(data: Array): String {
  return "processed"
}
```

### Return Types

Return types specify expected return value:

```kx
fn calculate(): Number {
  return 42
}
```

## Type Checking

Type annotations are checked at runtime for function calls. Mismatches emit warnings but do not halt execution.

## Compatibility

Untyped code works identically to previous versions.
