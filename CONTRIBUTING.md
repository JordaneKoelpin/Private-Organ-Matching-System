# Contributing to Private Organ Matching

Thank you for your interest in contributing to the Private Organ Matching FHEVM example project! This document provides guidelines for contributing to make the process smooth and effective.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment**
   - Node.js >= 18.0.0
   - npm >= 9.0.0
   - Git
   - Code editor (VS Code recommended)

2. **Knowledge Base**
   - Solidity fundamentals
   - FHEVM basics (see [FHEVM Docs](https://docs.zama.ai/fhevm))
   - TypeScript/JavaScript
   - Hardhat framework

3. **Project Setup**
   ```bash
   git clone <repository-url>
   cd PrivacyOrganMatching
   npm install
   npm run compile
   npm test
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Code Contributions**
   - Bug fixes
   - New features
   - Performance improvements
   - Gas optimizations

2. **Documentation**
   - Improving existing docs
   - Adding examples
   - Fixing typos
   - Translating documentation

3. **Testing**
   - Adding test cases
   - Improving test coverage
   - Testing on different networks

4. **Issue Reports**
   - Bug reports
   - Feature requests
   - Documentation improvements

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/PrivacyOrganMatching.git
cd PrivacyOrganMatching

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/PrivacyOrganMatching.git
```

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/add-geographic-matching` - New features
- `fix/registration-validation-bug` - Bug fixes
- `docs/update-api-reference` - Documentation
- `test/add-matching-tests` - Tests
- `refactor/optimize-scoring` - Code refactoring

### 3. Make Changes

Follow our [Coding Standards](#coding-standards) and ensure:

- Code compiles without errors
- All tests pass
- New features have tests
- Documentation is updated
- Commits are well-formatted

### 4. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/PrivateOrganMatching.test.ts

# Check gas usage
REPORT_GAS=true npm test

# Run linter
npm run lint

# Check formatting
npm run prettier:check
```

### 5. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Good commit messages
git commit -m "feat: add geographic location matching"
git commit -m "fix: correct blood type validation"
git commit -m "docs: update DEVELOPER_GUIDE with new patterns"
git commit -m "test: add edge cases for organ type validation"

# Commit message format
# <type>: <description>
#
# [optional body]
#
# [optional footer]
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `test`: Adding tests
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Fill in the PR template
```

## Coding Standards

### Solidity Guidelines

1. **File Organization**
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.24;

   // Imports
   import { FHE } from "@fhevm/solidity/lib/FHE.sol";

   // Contract documentation
   /**
    * @title ContractName
    * @notice Brief description
    * @dev Detailed technical description
    */
   contract ContractName {
       // State variables
       // Events
       // Modifiers
       // Constructor
       // External functions
       // Public functions
       // Internal functions
       // Private functions
       // View functions
   }
   ```

2. **Naming Conventions**
   - Contracts: `PascalCase`
   - Functions: `camelCase`
   - Variables: `camelCase`
   - Constants: `UPPER_CASE`
   - Private functions: `_leadingUnderscore`
   - Internal functions: `_leadingUnderscore`

3. **Documentation**
   - Use NatSpec for all public/external functions
   - Include `@param` for all parameters
   - Include `@return` for return values
   - Add `@dev` notes for implementation details

   ```solidity
   /**
    * @notice Register as organ donor
    * @param _age Age of donor (18-80)
    * @param _bloodType Blood type (0-3)
    * @return True if registration successful
    * @dev Encrypts all sensitive data before storage
    */
   function registerDonor(uint8 _age, uint8 _bloodType) external returns (bool) {
       // Implementation
   }
   ```

4. **Gas Optimization**
   - Pack structs efficiently
   - Use appropriate uint sizes
   - Minimize storage operations
   - Use `calldata` for external function parameters

### TypeScript Guidelines

1. **Testing Standards**
   ```typescript
   describe("Feature Name", function () {
       /**
        * Test: Brief description
        * @category TestCategory
        *
        * Detailed explanation of what this test validates
        */
       it("Should perform expected behavior", async function () {
           // Arrange
           const donor = await setupDonor();

           // Act
           const tx = await contract.registerDonor(...);

           // Assert
           await expect(tx)
               .to.emit(contract, "DonorRegistered")
               .withArgs(donor.address);
       });
   });
   ```

2. **Code Formatting**
   - Use Prettier for formatting
   - 2 spaces for indentation
   - Semicolons required
   - Single quotes for strings

### Code Review Checklist

Before submitting, verify:

- ✅ Code compiles without warnings
- ✅ All tests pass
- ✅ New code has test coverage
- ✅ Documentation updated
- ✅ No console.log statements
- ✅ No commented-out code
- ✅ Follows naming conventions
- ✅ Gas optimized where possible
- ✅ Security considerations addressed

## Testing Guidelines

### Writing Tests

1. **Test Organization**
   ```typescript
   describe("Contract Functionality", function () {
       describe("Registration", function () {
           it("Should allow valid registration", ...);
           it("Should reject invalid age", ...);
           it("Should prevent duplicate registration", ...);
       });

       describe("Matching", function () {
           it("Should calculate correct score", ...);
           it("Should handle edge cases", ...);
       });
   });
   ```

2. **Test Coverage Requirements**
   - All public/external functions tested
   - Happy path scenarios covered
   - Edge cases tested
   - Error conditions verified
   - Access control validated

3. **Testing FHEVM Contracts**
   ```typescript
   it("Should encrypt and store medical data", async function () {
       // Register with specific values
       await contract.connect(donor).registerDonor(35, 1, 2, 150, 50);

       // Verify registration event
       // Note: Cannot directly read encrypted values
       expect(await contract.getActiveDonorsCount()).to.equal(1);
   });
   ```

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- test/PrivateOrganMatching.test.ts

# With gas reporting
REPORT_GAS=true npm test

# With coverage
npm run coverage
```

## Documentation

### Documentation Standards

1. **Code Comments**
   - Explain WHY, not WHAT
   - Document complex logic
   - Add FHEVM pattern references
   - Include security notes

2. **README Updates**
   - Update if adding new features
   - Add usage examples
   - Update API reference
   - Include migration notes

3. **DEVELOPER_GUIDE Updates**
   - Document new patterns
   - Add examples for new features
   - Update troubleshooting section

4. **Inline Documentation**
   ```solidity
   /**
    * @notice Calculate compatibility score
    * @dev Uses multiple encrypted factors:
    * - Blood type: 30 points
    * - Organ type: 40 points
    * - Age compatibility: 15 points
    *
    * @custom:fhevm-pattern Uses FHE.select for conditional scoring
    * @custom:security All calculations on encrypted data
    */
   ```

## Pull Request Process

### Before Submitting

1. **Update from main**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run full test suite**
   ```bash
   npm run compile
   npm test
   npm run lint
   ```

3. **Update documentation**
   - README.md if needed
   - DEVELOPER_GUIDE.md for new patterns
   - Inline comments

### Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] All existing tests pass
- [ ] Added new tests for changes
- [ ] Tested on local network
- [ ] Tested on testnet (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Gas optimization considered

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information
```

### Review Process

1. **Automated Checks**
   - Tests must pass
   - Linter must pass
   - No merge conflicts

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussions constructive

3. **Merging**
   - Squash commits if needed
   - Maintainer will merge
   - Delete feature branch after merge

## Reporting Issues

### Bug Reports

Use the bug report template and include:

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Deploy contract with...
2. Call function with...
3. Observe error...

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Environment**
- Node version:
- npm version:
- Network:
- Solidity version:

**Additional context**
Logs, screenshots, etc.
```

### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why this feature is needed

**Proposed Solution**
How you envision implementing it

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## Community

### Getting Help

- **Documentation**: Start with README.md and DEVELOPER_GUIDE.md
- **Zama Discord**: https://discord.com/invite/fhe-org
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For general questions

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## Development Tips

### Local Development

```bash
# Start local Hardhat node
npm run dev

# In another terminal, deploy
npm run deploy

# Run tests against local node
npm test
```

### Debugging

```solidity
// Use events for debugging
event DebugLog(string message, uint256 value);
emit DebugLog("Score calculated", scoreValue);
```

### Gas Optimization Tips

- Use `++i` instead of `i++` in loops
- Pack struct variables efficiently
- Use `calldata` for external function parameters
- Minimize storage reads/writes
- Use events instead of storage where possible

## Thank You!

Thank you for contributing to Private Organ Matching! Your efforts help advance privacy-preserving healthcare applications on the blockchain.

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Ask in the Zama Discord
- Review existing PRs for examples

Happy coding! 🚀
