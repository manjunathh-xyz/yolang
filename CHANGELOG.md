# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.20.0] - 2025-12-14

### Added

- Optional typing system with type annotations
- Structured error system with detailed information
- Runtime profiling with execution timing
- Formal language specification in /spec
- Enhanced stack traces and introspection
- Determinism guarantees and async scheduling rules

### Improved

- Error messages with clearer context and suggestions
- CLI tooling with better feedback
- Package validation and GitHub-based system refinement
- Runtime safety with no panics
- Documentation authority with spec references

### Notes

- Major language maturity release
- No breaking changes
- All v1.x code continues to work

## [1.1.1] - 2025-12-14

### Fixed

- Parser bug allowing files without trailing newlines
- Multiple package bugs and inconsistencies
- Incorrect edge-case behavior

### Added

- Missing core functions for arrays, strings, numbers, and type checks
- Improved datatype completeness
- Enhanced error messages and consistency

### Notes

- Patch release for stability and completeness

## [1.1.0] - 2025-12-14

### Added

- Complete Kexra documentation (120+ pages)
- Vercel-hosted web app with package ecosystem
- Per-package documentation and website content
- GitHub-based static site generation
- Comprehensive language reference
- Package authoring guides
- Runtime internals documentation

### Changed

- Documentation is now the primary product deliverable
- Web app serves as documentation and package discovery platform
- All content sourced directly from repository files

## [Unreleased]

### Changed

- Removed full website, documentation, and IDE
- Introduced a minimal landing page
- Simplified project public surface

## [0.9.8] - 2025-12-14

### Changed

- Removed backend registry and publishing system
- Switched to GitHub-based package registry
- Packages are now contributed via pull requests

## [0.9.7] - 2025-12-14

### Fixed

- All TypeScript compilation errors
- Parser and package manager issues resolved

### Notes

- Clean build achieved

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
