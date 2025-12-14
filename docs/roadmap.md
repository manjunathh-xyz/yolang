# Roadmap

This page outlines the planned development direction for Kexra, from short-term improvements to long-term vision.

## v0.5.0 - Data Structures & I/O

The next major release will focus on expanding Kexra's capabilities with data structures and input/output.

### Planned Features

- **Arrays**: Ordered collections of values
  ```kx
  set numbers = [1, 2, 3, 4, 5]
  say numbers[0]  # First element
  ```

- **Objects**: Key-value data structures
  ```kx
  set person = { name: "Alice", age: 30 }
  say person.name
  ```

- **File I/O**: Reading from and writing to files
  ```kx
  set content = readFile("data.txt")
  writeFile("output.txt", "Hello, World!")
  ```

- **String methods**: Built-in functions for string manipulation
  ```kx
  set text = "hello world"
  say text.upper()  # "HELLO WORLD"
  say text.length() # 11
  ```

### Timeline

Target release: Q1 2025

## v0.6.0 - Standard Library

Expand the standard library with useful functions and utilities.

### Planned Features

- **Math functions**: `sin`, `cos`, `sqrt`, `random`
- **String utilities**: `split`, `join`, `replace`, `substring`
- **Array methods**: `push`, `pop`, `sort`, `filter`
- **Date/time functions**: Current date, formatting
- **Type conversion**: `toString`, `toNumber`, `isNumber`

## v1.0.0 - Production Ready

The 1.0 release will make Kexra suitable for real-world scripting tasks.

### Goals

- **Stability**: Comprehensive test suite, bug-free core
- **Performance**: Optimized interpreter, faster execution
- **Tooling**: VS Code extension, debugger, formatter
- **Documentation**: Complete reference, tutorials, examples
- **Community**: Package manager, plugin system

### Key Features

- **Modules**: Import/export between files
- **Error handling**: Try/catch for robust programs
- **Advanced types**: More data types, type checking
- **Concurrency**: Basic async/await support
- **Web integration**: Run Kexra in browsers

## Long-term Vision

Beyond 1.0, Kexra aims to be:

### Educational Platform

- **Language design toolkit**: Easy to extend and modify
- **Teaching resource**: Used in programming courses
- **Research platform**: Test new language features

### Production Language

- **Scripting**: Automation, configuration, build scripts
- **Data processing**: ETL pipelines, data analysis
- **Web development**: Server-side scripting, API development
- **Embedded systems**: IoT and microcontroller programming

## Contributing

The roadmap is flexible and community-driven. Features are prioritized based on:

- **User feedback**: What do people need?
- **Educational value**: Does it teach important concepts?
- **Implementation complexity**: Can it be done well?

### How to Influence the Roadmap

- **GitHub Issues**: Report bugs, request features
- **Discussions**: Share use cases and ideas
- **Pull Requests**: Implement features yourself
- **Surveys**: Participate in community surveys

## Current Status

- ✅ **v0.4.0**: Functions, website, documentation
- 🔄 **v0.4.1**: Documentation unification (current)
- 🚧 **v0.5.0**: Data structures (in development)

## Philosophy

Kexra's development follows these principles:

- **Incremental**: Small, focused releases
- **User-driven**: Features based on real needs
- **Educational**: Every feature teaches a concept
- **Quality**: Well-tested, well-documented code
- **Community**: Open to contributions and feedback

## Get Involved

Want to help shape Kexra's future?

- [GitHub Repository](https://github.com/manjunathh-xyz/kexra)
- [Issues](https://github.com/manjunathh-xyz/kexra/issues)
- [Discussions](https://github.com/manjunathh-xyz/kexra/discussions)