# Kexra Studio

Kexra Studio is a web-based integrated development environment (IDE) for writing, running, and debugging Kexra code directly in your browser.

## Features

- **Code Editor**: Syntax-highlighted editing with Monaco Editor
- **Run Button**: Execute code instantly
- **Output Panel**: View program output and errors
- **REPL Panel**: Interactive code evaluation
- **Examples**: Pre-built code samples to get started

## Getting Started

1. Open `studio/index.html` in your web browser
2. Write or load example code in the editor
3. Click "Run" to execute
4. View output in the right panel
5. Use the REPL for quick experiments

## Interface

```
┌─────────────────┬─────────────────┐
│ Code Editor     │ Output / Error  │
├─────────────────┴─────────────────┤
│ REPL                              │
└───────────────────────────────────┘
```

## Examples

Kexra Studio includes several example programs:

- **Hello World**: Basic output and variables
- **Functions**: Defining and calling functions
- **Loops**: For loops and while loops

## Browser Compatibility

Kexra Studio works in modern browsers that support:

- ES6 modules
- Monaco Editor
- Modern JavaScript APIs

## Development

The studio uses the same Kexra Runtime as the CLI and REPL, ensuring consistent behavior across all platforms.

## Limitations

- MVP version uses mock runtime
- Full runtime integration planned for future releases
- No file system access (browser security)