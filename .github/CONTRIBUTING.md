# Contributing to CAD Viewer

Thank you for your interest in contributing to CAD Viewer! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nextcloud-cad-viewer.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `pnpm test` and `composer test`
6. Commit your changes: `git commit -m "feat: add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

### Examples

```
feat: add support for DWG file preview
fix: resolve issue with DXF file loading
docs: update installation instructions
refactor: improve Vue component structure
```

## Code Style

### PHP
- Follow PSR-12 coding standards
- Run `composer run-script lint` before committing
- Use PHPStan for static analysis

### JavaScript/Vue
- Follow ESLint configuration
- Run `pnpm run lint` before committing
- Use TypeScript where possible

### CSS
- Follow stylelint configuration
- Use SCSS for complex styles

## Testing Requirements

- All new features must include tests
- Bug fixes should include regression tests
- Ensure all existing tests pass
- Test on PHP 8.5
- Test on Nextcloud 34
- Test on multiple databases (SQLite, MySQL, PostgreSQL)

## Pull Request Process

1. **Title**: Use conventional commit format
2. **Description**: Clearly describe what changes were made and why
3. **Testing**: Describe how you tested the changes
4. **Screenshots**: Include screenshots for UI changes
5. **Documentation**: Update documentation if needed

## Review Process

- All PRs require at least one review
- Automated checks must pass
- Code must follow project standards
- Tests must pass on all supported platforms

## Questions?

Feel free to open an issue if you have any questions about contributing!
