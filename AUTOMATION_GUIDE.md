# Automation Guide: FHEVM Example Generator

This guide explains how to use the automation tools to create new FHEVM example projects based on this template.

## Overview

This project includes automation scripts that allow you to:

1. **Generate standalone FHEVM examples** - Create complete, ready-to-use projects
2. **Auto-generate documentation** - Extract and format documentation from code
3. **Scaffold new projects** - Quickly bootstrap FHEVM development

## Table of Contents

- [Quick Start](#quick-start)
- [create-fhevm-example Script](#create-fhevm-example-script)
- [generate-docs Script](#generate-docs-script)
- [Examples Configuration](#examples-configuration)
- [Creating Custom Examples](#creating-custom-examples)
- [Advanced Usage](#advanced-usage)

## Quick Start

### Generate a New FHEVM Project

```bash
# Install dependencies (if not already done)
npm install

# Generate a new project in ../my-fhevm-project
npx ts-node scripts/create-fhevm-example.ts ../my-fhevm-project

# Navigate to the new project
cd ../my-fhevm-project

# Install dependencies
npm install

# Compile and test
npm run compile
npm test
```

## create-fhevm-example Script

### Description

The `create-fhevm-example.ts` script generates a complete, standalone FHEVM example project by:

1. Copying contract and test files
2. Copying deployment scripts
3. Copying configuration files
4. Generating project-specific README
5. Creating environment templates
6. Initializing git repository

### Usage

```bash
npx ts-node scripts/create-fhevm-example.ts <output-directory> [example-name]
```

### Parameters

- `<output-directory>` (required): Where to create the new project
- `[example-name]` (optional): Which example to use (default: 'private-organ-matching')

### Examples

#### Example 1: Basic Usage

```bash
# Create in ../my-organ-matching
npx ts-node scripts/create-fhevm-example.ts ../my-organ-matching
```

#### Example 2: Specify Example Name

```bash
# Use specific example configuration
npx ts-node scripts/create-fhevm-example.ts ../healthcare-privacy private-organ-matching
```

#### Example 3: Create in Current Directory

```bash
# Create in ./test-project
npx ts-node scripts/create-fhevm-example.ts ./test-project
```

### What Gets Created

```
output-directory/
├── contracts/
│   └── PrivateOrganMatching.sol    # Smart contract
├── test/
│   └── PrivateOrganMatching.test.ts # Test suite
├── scripts/
│   └── deploy.ts                    # Deployment script
├── hardhat.config.ts                # Hardhat configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

### Generated Project Features

The generated project includes:

- ✅ **Complete contract** - Fully documented Solidity contract
- ✅ **Comprehensive tests** - 40+ test cases
- ✅ **Deployment script** - Ready-to-use deployment
- ✅ **Configuration** - Hardhat, TypeScript, environment
- ✅ **Documentation** - Auto-generated README
- ✅ **Git ready** - Initialized repository with .gitignore

### Post-Generation Steps

After generating a project:

```bash
cd <output-directory>

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Compile contracts
npm run compile

# 4. Run tests
npm test

# 5. Deploy
npm run deploy           # Local
npm run deploy:sepolia   # Testnet
```

## generate-docs Script

### Description

The `generate-docs.ts` script auto-generates documentation by:

1. Extracting FHEVM patterns from contracts
2. Extracting test descriptions
3. Generating formatted README
4. Creating Getting Started guide
5. Formatting for GitBook compatibility

### Usage

```bash
# Generate all documentation
npx ts-node scripts/generate-docs.ts

# Generate specific documentation
npx ts-node scripts/generate-docs.ts --readme
npx ts-node scripts/generate-docs.ts --getting-started
```

### Generated Files

- `README.md` - Main project documentation
- `docs/GETTING_STARTED.md` - Setup and usage guide

### Documentation Features

The generated documentation includes:

1. **Project Overview**
   - Description and features
   - FHEVM patterns demonstrated
   - Use case explanation

2. **Installation Guide**
   - Prerequisites
   - Step-by-step setup
   - Configuration instructions

3. **API Reference**
   - Function signatures
   - Parameter descriptions
   - Usage examples

4. **Test Coverage**
   - Test categories
   - Test descriptions
   - Coverage statistics

5. **FHEVM Patterns**
   - Pattern explanations
   - Code examples
   - Best practices

6. **Resources**
   - Links to documentation
   - Community resources
   - Learning materials

### Customizing Documentation

To customize generated documentation, edit the templates in `scripts/generate-docs.ts`:

```typescript
// Customize README template
function generateReadme(): string {
    // Your custom template here
}

// Customize Getting Started guide
function generateGettingStarted(): string {
    // Your custom template here
}
```

## Examples Configuration

### Configuration File

The `examples.config.ts` file defines available FHEVM examples:

```typescript
export const EXAMPLES: Record<string, ExampleMetadata> = {
    'private-organ-matching': {
        id: 'private-organ-matching',
        name: 'Private Organ Matching',
        description: '...',
        contractName: 'PrivateOrganMatching',
        // ... more configuration
    }
};
```

### Example Metadata

Each example includes:

- **Basic Information**
  - `id`: Unique identifier
  - `name`: Display name
  - `description`: Full description
  - `category`: Classification (Healthcare, Finance, etc.)
  - `difficulty`: beginner | intermediate | advanced

- **Files**
  - `contractFile`: Path to Solidity contract
  - `testFile`: Path to test file
  - `contractName`: Main contract name

- **FHEVM Patterns**
  - List of demonstrated patterns
  - Pattern descriptions
  - Code examples

- **Metadata**
  - Keywords for searchability
  - Gas estimates
  - Version information
  - License

### Available Functions

```typescript
// Get all examples
const examples = getAllExamples();

// Get examples by category
const healthcareExamples = getExamplesByCategory('Healthcare');

// Get examples by difficulty
const beginnerExamples = getExamplesByDifficulty('beginner');

// Search examples
const results = searchExamples('privacy');

// Get specific example
const example = getExample('private-organ-matching');
```

## Creating Custom Examples

### Step 1: Add Your Contract

Create your FHEVM contract in `contracts/`:

```solidity
// contracts/MyExample.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8 } from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title MyExample
 * @notice Your FHEVM example
 * @custom:fhevm-pattern Demonstrates encrypted storage
 */
contract MyExample {
    // Your implementation
}
```

### Step 2: Add Tests

Create tests in `test/`:

```typescript
// test/MyExample.test.ts
describe("MyExample", function () {
    /**
     * Test: Description
     * @category YourCategory
     */
    it("Should perform expected behavior", async function () {
        // Your tests
    });
});
```

### Step 3: Configure Example

Add to `examples.config.ts`:

```typescript
export const EXAMPLES: Record<string, ExampleMetadata> = {
    // ... existing examples
    'my-example': {
        id: 'my-example',
        name: 'My FHEVM Example',
        description: 'Description of your example',
        contractName: 'MyExample',
        contractFile: 'contracts/MyExample.sol',
        testFile: 'test/MyExample.test.ts',
        fhevmPatterns: [
            {
                name: 'Pattern Name',
                description: 'What it demonstrates',
                code: 'euint8 value = FHE.asEuint8(42);'
            }
        ],
        category: 'Your Category',
        difficulty: 'intermediate',
        keywords: ['keyword1', 'keyword2'],
        // ... more metadata
    }
};
```

### Step 4: Update Script

Update `scripts/create-fhevm-example.ts` to include your example:

```typescript
const EXAMPLES: Record<string, ExampleConfig> = {
    // ... existing examples
    'my-example': {
        name: 'My FHEVM Example',
        description: 'Your description',
        contractName: 'MyExample',
        contractFile: 'contracts/MyExample.sol',
        testFile: 'test/MyExample.test.ts',
        fhevmPatterns: ['Pattern 1', 'Pattern 2'],
        category: 'your-category'
    }
};
```

### Step 5: Generate & Test

```bash
# Generate your example
npx ts-node scripts/create-fhevm-example.ts ../test-my-example my-example

# Test the generated project
cd ../test-my-example
npm install
npm run compile
npm test
```

## Advanced Usage

### Custom Project Structure

You can modify the generator to create custom structures:

```typescript
// In create-fhevm-example.ts
function createCustomStructure(outputDir: string): void {
    // Create additional directories
    fs.mkdirSync(path.join(outputDir, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(outputDir, 'utils'), { recursive: true });

    // Copy additional files
    copyFile('path/to/extra/file', path.join(outputDir, 'destination'));
}
```

### Template Customization

Customize generated files by modifying the template functions:

```typescript
// Custom README template
function generateCustomReadme(config: ExampleConfig): string {
    return `
# ${config.name}

Your custom template content here...

## Custom Section
${config.description}
    `.trim();
}
```

### Batch Generation

Generate multiple examples at once:

```bash
# Create a batch script
cat > generate-all.sh << 'EOF'
#!/bin/bash
for example in private-organ-matching another-example; do
    npx ts-node scripts/create-fhevm-example.ts "../output/$example" "$example"
done
EOF

chmod +x generate-all.sh
./generate-all.sh
```

### CI/CD Integration

Integrate generation in CI/CD:

```yaml
# .github/workflows/generate-examples.yml
name: Generate Examples

on:
  push:
    branches: [ main ]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx ts-node scripts/create-fhevm-example.ts ./output
      - run: cd output && npm test
```

## Automation Scripts Reference

### Available Scripts

```json
{
  "scripts": {
    "create:example": "ts-node scripts/create-fhevm-example.ts",
    "generate:docs": "ts-node scripts/generate-docs.ts"
  }
}
```

### Script Options

#### create-fhevm-example.ts Options

```typescript
// Help
npx ts-node scripts/create-fhevm-example.ts --help

// List available examples
npx ts-node scripts/create-fhevm-example.ts --list

// Generate with verbose output
DEBUG=true npx ts-node scripts/create-fhevm-example.ts ./output
```

#### generate-docs.ts Options

```typescript
// Generate all documentation
npx ts-node scripts/generate-docs.ts

// Generate specific sections
npx ts-node scripts/generate-docs.ts --section readme
npx ts-node scripts/generate-docs.ts --section getting-started
npx ts-node scripts/generate-docs.ts --section api-reference
```

## Best Practices

### 1. Version Control

```bash
# Create a new branch for generated examples
git checkout -b feature/new-example

# Generate example
npx ts-node scripts/create-fhevm-example.ts ./new-example

# Test thoroughly
cd new-example && npm test

# Commit and push
git add .
git commit -m "Add new FHEVM example"
```

### 2. Testing

Always test generated projects:

```bash
# Test compilation
npm run compile

# Test functionality
npm test

# Test deployment (local)
npm run dev &
npm run deploy

# Test on testnet
npm run deploy:sepolia
```

### 3. Documentation

Keep documentation in sync:

```bash
# After modifying contracts, regenerate docs
npx ts-node scripts/generate-docs.ts

# Review generated documentation
cat README.md
cat docs/GETTING_STARTED.md
```

### 4. Maintenance

When updating FHEVM or dependencies:

```bash
# 1. Update dependencies in base project
npm update @fhevm/solidity

# 2. Test changes
npm run compile && npm test

# 3. Regenerate examples
npx ts-node scripts/create-fhevm-example.ts ./updated-example

# 4. Verify compatibility
cd updated-example && npm install && npm test
```

## Troubleshooting

### Issue: "Directory already exists"

```bash
# Solution: Use a different output directory or remove existing one
rm -rf ./existing-directory
npx ts-node scripts/create-fhevm-example.ts ./existing-directory
```

### Issue: "Cannot find module"

```bash
# Solution: Install dependencies first
npm install
npx ts-node scripts/create-fhevm-example.ts ./output
```

### Issue: "Permission denied"

```bash
# Solution: Check directory permissions
chmod +x scripts/create-fhevm-example.ts
npx ts-node scripts/create-fhevm-example.ts ./output
```

### Issue: "Generated project doesn't compile"

```bash
# Solution: Ensure base project compiles first
npm run compile  # In base project

# Then generate
npx ts-node scripts/create-fhevm-example.ts ./output

# Try in generated project
cd output
npm install
npm run compile
```

## Examples

### Example 1: Generate for Tutorial

```bash
# Create tutorial project
npx ts-node scripts/create-fhevm-example.ts ../fhevm-tutorial

cd ../fhevm-tutorial
npm install

# Follow the tutorial steps
npm run compile
npm test
npm run deploy
```

### Example 2: Generate for Hackathon

```bash
# Create starter project for hackathon
npx ts-node scripts/create-fhevm-example.ts ../hackathon-starter

cd ../hackathon-starter

# Customize for your use case
# ... make modifications ...

# Test and deploy
npm test
npm run deploy:sepolia
```

### Example 3: Generate for Learning

```bash
# Create multiple examples for learning
for difficulty in beginner intermediate advanced; do
    npx ts-node scripts/create-fhevm-example.ts "../learn-$difficulty"
done
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Node.js Documentation](https://nodejs.org/)

## Contributing

To improve the automation tools:

1. Fork the repository
2. Make your improvements
3. Test thoroughly
4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Support

Need help with automation tools?

- Read this guide carefully
- Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- Open an issue on GitHub
- Ask in Zama Discord

---

**Automation tools built for Zama FHEVM** 🤖
