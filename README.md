# 🚀 Kexra

> A simple, educational scripting language

[![npm version](https://img.shields.io/npm/v/kexra.svg)](https://www.npmjs.com/package/kexra)
[![GitHub license](https://img.shields.io/github/license/manjunathh-xyz/kexra)](https://github.com/manjunathh-xyz/kexra/blob/main/LICENSE)

Kexra is an interpreted scripting language designed for learning programming concepts. Simple syntax, clear error messages, and comprehensive documentation make it perfect for beginners and students.

**v0.5.0 - Arrays, Objects & Standard Library** ✨

## 📦 Installation

```bash
npm install -g kexra
```

## 🚀 Quick Start

Create `hello.kx`:

```kx
# Arrays and objects in v0.5.0!
set numbers = [1, 2, 3, 4, 5]
set user = { name: "Kexra", version: 0.5 }

say "Hello, " + user.name + "! (v" + user.version + ")"
say "Array length: " + len(numbers)
```

Run it:

```bash
kex run hello.kx
```

## 📚 Documentation

Full documentation: https://kexra.js.org/docs

- [Getting Started](https://github.com/manjunathh-xyz/kexra/blob/main/docs/getting-started.md)
- [Language Basics](https://github.com/manjunathh-xyz/kexra/blob/main/docs/language-basics.md)
- [Functions](https://github.com/manjunathh-xyz/kexra/blob/main/docs/functions.md)
- [Control Flow](https://github.com/manjunathh-xyz/kexra/blob/main/docs/control-flow.md)

## 🌐 Website

Visit the website: https://kexra.js.org

## ✨ Features

- Simple, English-like syntax
- Interactive REPL
- User-defined functions
- **Arrays and objects** (v0.5.0)
- **Standard library** with built-in functions (v0.5.0)
- Clear error messages
- Educational focus

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using TypeScript