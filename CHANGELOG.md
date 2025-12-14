# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Removed full website, documentation, and IDE
- Introduced a minimal landing page
- Simplified project public surface

## [0.9.5] - 2025-12-14

### Changed

- Migrated registry backend to Fly.io

### Notes

- No user-facing changes

## [0.9.4] - 2025-12-14

### Improved

- Language parity with JS/Python
- Async and error system reliability
- Package system completeness
- Registry accuracy

### Notes

- No breaking changes

## [0.9.3] - 2025-12-14

### Added

- Web-based package registry
- Public package browsing and search

### Notes

- No language or runtime changes

## [0.9.2] - 2025-12-14

### Added

- Package publishing system
- Registry-based installs

### Notes

- No language or runtime changes

## [0.9.1] - 2025-12-14

### Added

- Built-in math module
- Package authoring guide

### Notes

- No breaking changes

## [0.5.1] - 2025-12-14

### Fixed

- Version reporting in CLI commands
- Package.json reading for published packages

### Notes

- Patch release for version display fix

## [0.5.0] - 2025-12-14

### Added

- **Arrays**: Ordered collections with `[]` syntax and zero-based indexing
- **Objects**: Key-value data structures with `{}` syntax and dot/bracket access
- **Indexing**: Support for `array[index]` and `object["key"]` syntax
- **Standard Library**: Built-in functions (`len`, `type`, `print`, `keys`, `values`)
- **Enhanced Type System**: Unified `Value` type for runtime type safety

### Changed

- **Runtime Architecture**: Complete rewrite for complex data types
- **Parser Extensions**: Added parsing for arrays, objects, and indexing
- **Error Handling**: Improved error messages with bounds checking

### Notes

- Major language expansion from simple expressions to data structures
- Foundation for real programming with collections and objects

## [0.4.2] - 2025-12-14

### Changed

- Rebuilt website and documentation from scratch
- Introduced docs-first structure inspired by modern OSS projects

### Removed

- Old website and documentation structure

### Notes

- No language or runtime changes
- Documentation-only release

## [0.4.1] - 2025-12-14

### Added

- Complete documentation under `/docs`
- Detailed guides for syntax, functions, REPL, CLI, and errors
- Lightweight website landing page linking to docs
- Credits and roadmap documentation

### Changed

- Website now links directly to `/docs` as single source of truth
- README updated to reference docs
- Unified documentation structure

### Notes

- No language or CLI changes

## [0.4.0] - 2025-12-14

### Added

- User-defined functions with `fn` keyword
- Function calls with arguments
- `return` statements for exiting functions
- Local function scope with parameter passing
- Function registry and call stack handling
- Recursive function support
- Updated website documentation with functions guide
- Enhanced examples showcasing functions

### Changed

- Extended parser to handle function declarations and calls
- Extended interpreter with function execution capabilities
- Updated README with function syntax and examples
- Improved website navigation and content structure

### Fixed

- No regressions in existing syntax and features

## [0.3.0] - 2025-12-14

### Added

- Official Kexra website
- GitHub Pages hosting
- Language overview & examples
- Credits and contributor visibility

### Changed

- Project discoverability
- Documentation clarity
- Public project identity

## [0.2.1] - 2025-12-14

### Added

- Project metadata and documentation files
- Credits and acknowledgements
- CHANGELOG.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- CREDITS.md

### Changed

- README.md updated with credits section

## [0.2.0] - 2025-12-14

### Added

- Interactive REPL (`kex repl`)
- Improved CLI commands (`run`, `help`, `version`)
- Unified error handling system
- Multi-line block support in REPL
- Built-in REPL commands

### Changed

- CLI output styling
- Error reporting format

## [0.1.0] - 2025-12-14

### Added

- Initial language implementation
- File execution support
- Basic syntax: variables, math, conditionals, loops
- Lexer, parser, and interpreter
