# Contributing to Garhwali Seva

Thank you for your interest in contributing to Garhwali Seva! This document outlines the guidelines for contributing to our project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Ways to Contribute](#ways-to-contribute)
3. [Adding Dictionary Entries](#adding-dictionary-entries)
4. [Submitting Code Changes](#submitting-code-changes)
5. [Documentation Contributions](#documentation-contributions)
6. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Our Standards

- **Be Respectful**: Treat all contributors with respect
- **Be Inclusive**: Welcome newcomers and diverse perspectives
- **Be Constructive**: Provide helpful, constructive feedback
- **Be Patient**: Remember we're all volunteers

---

## Ways to Contribute

### 1. Dictionary Contributions (No Code Required)

The easiest way to contribute is by adding words to our dictionary:

1. Visit the [Contribute](/contribute) page on the website
2. Fill out the form with:
   - Garhwali word/phrase
   - Hindi translation
   - English translation
   - Usage example (optional)
3. Submit for review

### 2. Bug Reports

Help us find and fix issues:

1. Check if the issue already exists in [Issues](https://github.com/yourusername/garhwali-seva/issues)
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)

### 3. Feature Requests

Suggest new features:

1. Check existing feature requests
2. Describe the feature clearly
3. Explain the use case
4. Provide examples if possible

### 4. Code Contributions

See [Submitting Code Changes](#submitting-code-changes)

### 5. Documentation

Improve or translate documentation:

1. Find docs that need improvement
2. Make changes
3. Submit for review

---

## Adding Dictionary Entries

### Quick Submission (Website)

Use the Contribute page for quick submissions.

### Manual JSON Addition

For bulk additions, edit `lib/garhwali_dictionary.json`:

```json
{
  "garhwali_word": "YourWord",
  "hindi_meaning": "हिंदी अर्थ",
  "english_meaning": "English meaning",
  "usage_example": "Example sentence in Garhwali",
  "category": "noun"
}
```

### Category Guidelines

| Category | When to Use | Example |
|----------|-------------|---------|
| `phrase` | Complete expressions | "Namaste" |
| `noun` | People, places, things | "Ghar" (House) |
| `verb` | Actions | "Karna" (To do) |
| `adjective` | Descriptions | "Accha" (Good) |
| `song_phrase` | Song-specific | Traditional lines |

### Validation

Before submitting, verify:

- [ ] Spelling is correct Devanagari
- [ ] Translations are accurate
- [ ] Category is appropriate
- [ ] Example shows correct usage

---

## Submitting Code Changes

### Prerequisites

- Git installed
- Node.js 18+
- npm 9+

### Setup

1. **Fork the repository**

2. **Clone your fork**

```bash
git clone https://github.com/YOURUSERNAME/garhwali-seva.git
cd garhwali-seva
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/ORIGINALOWNER/garhwali-seva.git
```

4. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

### Development Workflow

1. **Install dependencies**

```bash
npm install
```

2. **Make your changes**

3. **Run tests**

```bash
npm test
```

4. **Run linter**

```bash
npm run lint
```

5. **Build the project**

```bash
npm run build
```

### Pull Request Process

1. **Update your branch**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes**

```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request**

- Go to GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the template
- Submit

### PR Title Convention

```
{type}: {description}

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Testing
- chore: Maintenance
```

Example: `feat: Add new Garhwali words to dictionary`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Dictionary update
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Other

## Testing
Describe how you tested the changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

---

## Documentation Contributions

### Improving Existing Docs

1. Find the documentation file
2. Make improvements
3. Submit PR

### Translating Docs

1. Copy the English file
2. Append language code (e.g., `README.hi.md` for Hindi)
3. Translate content
4. Submit PR

### Writing New Docs

1. Choose appropriate location in `docs/`
2. Follow existing documentation style
3. Include examples
4. Link from relevant docs

---

## Reporting Issues

### Before Reporting

1. Search existing issues
2. Update to the latest version
3. Test with a fresh install

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

---

## Recognition

Contributors are recognized in:

- [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Release notes
- Project documentation

---

## Questions?

If you have questions:

1. Check existing [Issues](https://github.com/yourusername/garhwali-seva/issues)
2. Start a [Discussion](https://github.com/yourusername/garhwali-seva/discussions)
3. Email: support@garhwaliseva.example.com

---

Thank you for contributing to Garhwali Seva! 🏔️
