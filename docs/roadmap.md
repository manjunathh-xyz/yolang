# Roadmap

This page outlines Kexra's development direction and planned features.

## Current Status

- ✅ **v0.4.2**: Complete documentation rebuild
- 🔄 **v0.4.1**: Documentation unification
- ✅ **v0.4.0**: Functions and basic features

## v0.5.0 - Data Structures

### Arrays

Ordered collections of values:

```kx
set numbers = [1, 2, 3, 4, 5]
say numbers[0]  # Access elements
set numbers[2] = 10  # Modify elements
```

### Objects

Key-value data structures:

```kx
set person = {
  name: "Alice",
  age: 30,
  city: "New York"
}

say person.name
set person.age = 31
```

### Array Methods

Built-in functions for arrays:

```kx
set list = [3, 1, 4, 1, 5]
set sorted = list.sort()
set length = list.length()
```

## v0.6.0 - Standard Library

### String Functions

```kx
set text = "hello world"
say text.upper()     # "HELLO WORLD"
say text.split(" ")  # ["hello", "world"]
say text.length()    # 11
```

### Math Functions

```kx
say math.sqrt(16)    # 4
say math.random()    # Random number
say math.pi          # 3.14159
```

### File I/O

```kx
set content = read_file("data.txt")
write_file("output.txt", "Hello, World!")
```

## v1.0.0 - Production Ready

### Module System

```kx
import "math"
import "utils" from "./utils.kx"
```

### Error Handling

```kx
try {
  risky_operation()
} catch error {
  say "Error: " + error
}
```

### Performance Improvements

- Bytecode compilation
- Optimized interpreter
- Memory management

## Long-term Vision

### Advanced Features

- Classes and inheritance
- Concurrency support
- Network operations
- Database connectivity

### Tooling

- VS Code extension
- Debugger
- Package manager
- Web playground

## Contributing

The roadmap is community-driven. Ways to contribute:

- **Issues**: Report bugs and request features
- **Discussions**: Share ideas and use cases
- **Pull Requests**: Implement features
- **Feedback**: Test new features and provide input

## Philosophy

- **Incremental**: Small, focused releases
- **User-driven**: Features based on real needs
- **Educational**: Every feature teaches concepts
- **Quality**: Well-tested, well-documented
- **Community**: Open to contributions

See [GitHub Issues](https://github.com/manjunathh-xyz/kexra/issues) for detailed feature requests.