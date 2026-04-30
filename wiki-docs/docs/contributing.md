---
sidebar_position: 7
---

# Contributing

We welcome contributions to Nextcloud CAD Viewer! This guide helps you get started.

## Ways to Contribute

### 🐛 Report Bugs

Found a bug? Create an issue on GitHub with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (Nextcloud version, browser, OS)

### 💡 Suggest Features

Have an idea? Open a feature request discussion:

- Describe the feature and its benefits
- Explain your use case
- Provide examples if possible

### 📝 Improve Documentation

Documentation improvements are always welcome:

- Fix typos or unclear sections
- Add missing information
- Improve examples
- Translate to other languages

### 👨‍💻 Write Code

Ready to contribute code? Follow these steps:

## Development Workflow

### 1. Fork the Repository

Click "Fork" on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/nextcloud-cad-viewer.git
cd nextcloud-cad-viewer
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-123
```

### 4. Make Changes

Follow the [Development Setup](./development/setup.md) guide to set up your environment.

### 5. Test Your Changes

```bash
# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### 6. Commit Changes

Write clear commit messages:

```bash
git commit -m "fix: resolve loading issue with large DWG files

- Improved memory management for files over 50MB
- Added progress indicator for long operations
- Fixes #123"
```

### 7. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Coding Standards

### JavaScript/Vue

- Use ES6+ syntax
- Follow Vue.js style guide
- Use meaningful variable names
- Add comments for complex logic

### PHP

- Follow PSR-12 coding standards
- Use type hints where possible
- Add PHPDoc comments
- Write unit tests for new features

### CSS

- Use BEM naming convention
- Keep selectors specific
- Avoid !important when possible
- Test responsive design

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass locally
- [ ] Code is linted
- [ ] Documentation updated
- [ ] Changelog entry added (if applicable)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change

## Related Issues
Closes #123
```

## Review Process

1. **Automated Checks**: CI runs tests and linting
2. **Code Review**: Maintainer reviews your code
3. **Feedback**: Address any requested changes
4. **Merge**: PR is merged once approved

## Community Guidelines

### Be Respectful

- Treat everyone with respect
- Welcome newcomers
- Provide constructive feedback

### Communication

- Use English in issues and PRs
- Be clear and concise
- Link to relevant resources

### Questions?

- Check existing documentation first
- Search closed issues
- Ask in GitHub Discussions

## Recognition

Contributors are acknowledged in:

- CHANGELOG.md
- README.md contributors section
- GitHub Contributors page

Thank you for contributing to Nextcloud CAD Viewer! 🎉

Previous: [Troubleshooting](./troubleshooting.md)
