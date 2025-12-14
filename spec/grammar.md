# Kexra Language Specification

This document defines the formal specification for the Kexra programming language.

## Grammar

### Program

```
program ::= statement*
```

### Statements

```
statement ::= say_statement
           | set_statement
           | const_statement
           | check_statement
           | loop_statement
           | for_statement
           | function_declaration
           | return_statement
           | break_statement
           | continue_statement
           | try_statement
           | switch_statement
           | import_statement
           | export_statement
           | use_statement
           | newline
```

### Expressions

```
expression ::= ternary_expression

ternary_expression ::= logical_expression ('?' expression ':' expression)?

logical_expression ::= equality_expression (('and' | 'or') equality_expression)*

equality_expression ::= comparison_expression (('==' | '!=') comparison_expression)*

comparison_expression ::= term_expression (('>' | '>=' | '<' | '<=') term_expression)*

term_expression ::= factor_expression (('+' | '-') factor_expression)*

factor_expression ::= unary_expression (('*' | '/' | '%') unary_expression)*

unary_expression ::= ('not' | '-') unary_expression
                   | call_expression

call_expression ::= primary_expression ('(' arguments ')')*

primary_expression ::= NUMBER
                     | STRING
                     | 'true'
                     | 'false'
                     | 'null'
                     | IDENT
                     | '(' expression ')'
                     | '[' array_elements ']'
                     | '{' object_properties '}'
```

## Types

Kexra is dynamically typed with optional static type annotations.

### Primitive Types

- Number
- String
- Boolean
- Null
- Array
- Object
- Function

### Type Annotations

```
type_annotation ::= ':' IDENT
```

## Runtime Semantics

### Execution Model

Kexra uses a single-threaded, deterministic execution model with async support.

### Scoping

Lexical scoping with function-level scope.

### Error Handling

Errors are structured objects with type, message, and location information.
