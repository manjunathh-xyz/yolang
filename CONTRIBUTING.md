# Contributing to Kexra

Thank you for your interest in contributing to Kexra! This document outlines the process for contributing to the project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/manjunathh-xyz/kexra.git
   cd kexra
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd studio && npm install && cd ..
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Development Workflow

### 1. Choose an Issue
- Check [GitHub Issues](https://github.com/manjunathh-xyz/kexra/issues) for open tasks
- Look for issues labeled `good first issue` or `help wanted`

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow the coding standards (see below)
- Write tests for new features
- Update documentation as needed
- Run linting and formatting: `npm run lint:fix && npm run format`

### 4. Test Your Changes
```bash
npm test
# Test Studio locally
cd studio && npm run dev
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Create a Pull Request
- Push your branch to GitHub
- Open a PR with a clear description
- Reference any related issues

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Prefer `interface` over `type` for object shapes
- Use strict null checks
- Avoid `any` types

### Code Style
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format code
- Follow the existing patterns in the codebase

### Naming Conventions
- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and interfaces
- Use `UPPER_CASE` for constants

### Error Handling
- Throw `RuntimeError` for runtime issues
- Throw `SyntaxError` for parsing issues
- Provide helpful error messages

## Testing

- Write unit tests for new features
- Test both CLI and Studio behavior
- Ensure no regressions in existing functionality

## Documentation

- Update docs for any user-facing changes
- Follow the existing documentation style
- Test examples in the docs

## Commit Messages

Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `chore:` for maintenance

## Code of Conduct

Be respectful and inclusive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## Getting Help

- Open an issue for questions
- Join the discussion on GitHub
- Check existing issues and PRs

Thank you for contributing to Kexra! 🎉