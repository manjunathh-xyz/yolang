# Value System

Kexra's runtime value representation and type system.

## Why this exists

The value system provides the foundation for all data manipulation in Kexra.

## How it works

All values are wrapped in Value objects with type information for runtime type checking.

## Examples

Supported types:

- Numbers (64-bit floats)
- Strings (UTF-8)
- Booleans
- Arrays (dynamic)
- Objects (key-value maps)
- Functions
- Null

## Common mistakes

- Confusing value types with language types
- Not understanding type coercion rules

## Related topics

- [Data Types](../language-basics/data-types.md)
- [Type Helpers](../standard-library/type-helpers.md)
- [Execution Lifecycle](execution-lifecycle.md)
