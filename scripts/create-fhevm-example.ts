#!/usr/bin/env ts-node

/**
 * FHEVM Example Generator
 *
 * This script creates a standalone FHEVM example repository based on this template.
 * It copies the necessary files, updates configurations, and generates documentation.
 *
 * Usage:
 *   ts-node scripts/create-fhevm-example.ts <output-directory>
 *
 * Example:
 *   ts-node scripts/create-fhevm-example.ts ../my-fhevm-project
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

/**
 * Example metadata configuration
 */
interface ExampleConfig {
    name: string;
    description: string;
    contractName: string;
    contractFile: string;
    testFile: string;
    fhevmPatterns: string[];
    category: string;
}

/**
 * Available example configurations
 */
const EXAMPLES: Record<string, ExampleConfig> = {
    'private-organ-matching': {
        name: 'Private Organ Matching',
        description: 'Privacy-preserving organ donor-recipient matching using FHEVM',
        contractName: 'PrivateOrganMatching',
        contractFile: 'contracts/PrivateOrganMatching.sol',
        testFile: 'test/PrivateOrganMatching.test.ts',
        fhevmPatterns: [
            'Encrypted data storage (euint8, euint16)',
            'Access control (FHE.allowThis, FHE.allow)',
            'Encrypted arithmetic (add, sub, shr)',
            'Encrypted comparisons (eq, lt, gt, le, ge)',
            'Conditional logic (FHE.select)',
            'Public decryption (FHE.requestDecryption)',
            'Logical operations (FHE.and)'
        ],
        category: 'healthcare'
    }
};

/**
 * Print colored message to console
 */
function log(message: string, color: keyof typeof colors = 'reset'): void {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print header with decoration
 */
function printHeader(title: string): void {
    console.log('\n' + '='.repeat(60));
    log(title, 'bright');
    console.log('='.repeat(60) + '\n');
}

/**
 * Check if directory exists and is not empty
 */
function checkDirectory(dir: string): boolean {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        if (files.length > 0) {
            log(`❌ Error: Directory ${dir} already exists and is not empty`, 'red');
            return false;
        }
    }
    return true;
}

/**
 * Copy file with error handling
 */
function copyFile(src: string, dest: string): void {
    try {
        // Ensure destination directory exists
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(src, dest);
        log(`  ✓ ${path.basename(dest)}`, 'green');
    } catch (error) {
        log(`  ✗ Failed to copy ${path.basename(dest)}: ${error}`, 'red');
    }
}

/**
 * Copy directory recursively
 */
function copyDirectory(src: string, dest: string, exclude: string[] = []): void {
    if (!fs.existsSync(src)) {
        log(`  ⚠ Source directory ${src} not found, skipping`, 'yellow');
        return;
    }

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // Skip excluded files/directories
        if (exclude.includes(entry.name)) {
            continue;
        }

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, exclude);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

/**
 * Generate README for the new project
 */
function generateReadme(outputDir: string, config: ExampleConfig): void {
    const readme = `# ${config.name}

${config.description}

## Overview

This is a standalone FHEVM example demonstrating privacy-preserving smart contracts using Fully Homomorphic Encryption (FHE).

### FHEVM Patterns Demonstrated

${config.fhevmPatterns.map(pattern => `- ${pattern}`).join('\n')}

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

\`\`\`bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test
\`\`\`

## Usage

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test
\`\`\`

### Deploy

\`\`\`bash
# Deploy to local Hardhat network
npm run dev          # Terminal 1: Start local node
npm run deploy       # Terminal 2: Deploy contract

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to Zama DevNet
npm run deploy:zama
\`\`\`

### Verify Contract

\`\`\`bash
# Verify on Etherscan (Sepolia)
npm run verify -- --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## Project Structure

\`\`\`
${config.name.toLowerCase().replace(/\s+/g, '-')}/
├── contracts/              # Solidity smart contracts
│   └── ${config.contractName}.sol
├── test/                   # Test suite
│   └── ${config.contractName}.test.ts
├── scripts/                # Deployment and utility scripts
│   └── deploy.ts
├── hardhat.config.ts       # Hardhat configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
\`\`\`

## Contract Details

### ${config.contractName}

${config.description}

**Key Features:**
${config.fhevmPatterns.map(pattern => `- ${pattern}`).join('\n')}

**Main Functions:**
- See inline documentation in \`${config.contractFile}\`
- Comprehensive API reference in contract comments

## Testing

The test suite includes:
- Unit tests for all contract functions
- Integration tests for complete workflows
- Edge case and error condition testing
- Gas usage reporting

Run tests with:
\`\`\`bash
npm test
\`\`\`

## Configuration

### Environment Variables

Create a \`.env\` file from the template:

\`\`\`bash
cp .env.example .env
\`\`\`

Configure the following variables:

\`\`\`bash
# Sepolia RPC URL
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
\`\`\`

### Networks

Configured networks in \`hardhat.config.ts\`:

- **hardhat**: Local development network
- **localhost**: Local Hardhat node
- **sepolia**: Ethereum Sepolia testnet
- **zamaDevnet**: Zama FHEVM devnet

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/)
- [Zama Community](https://www.zama.ai/community)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with FHEVM by Zama** 🔐
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
    log(`  ✓ README.md`, 'green');
}

/**
 * Update package.json with project-specific information
 */
function updatePackageJson(outputDir: string, config: ExampleConfig): void {
    const packageJsonPath = path.join(outputDir, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        log(`  ⚠ package.json not found, skipping update`, 'yellow');
        return;
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Update project name and description
        packageJson.name = config.name.toLowerCase().replace(/\s+/g, '-');
        packageJson.description = config.description;

        // Update version to 1.0.0 for new project
        packageJson.version = '1.0.0';

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        log(`  ✓ Updated package.json`, 'green');
    } catch (error) {
        log(`  ✗ Failed to update package.json: ${error}`, 'red');
    }
}

/**
 * Create .gitignore file
 */
function createGitignore(outputDir: string): void {
    const gitignore = `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Hardhat
cache/
artifacts/
typechain-types/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
coverage/
coverage.json

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
.nyc_output/

# Deployment
deployments/
`;

    fs.writeFileSync(path.join(outputDir, '.gitignore'), gitignore);
    log(`  ✓ .gitignore`, 'green');
}

/**
 * Create .env.example file
 */
function createEnvExample(outputDir: string): void {
    const envExample = `# Network RPC URLs
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
ZAMA_RPC_URL=https://devnet.zama.ai

# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
`;

    fs.writeFileSync(path.join(outputDir, '.env.example'), envExample);
    log(`  ✓ .env.example`, 'green');
}

/**
 * Initialize git repository
 */
function initGitRepo(outputDir: string): void {
    try {
        process.chdir(outputDir);
        execSync('git init', { stdio: 'ignore' });
        execSync('git add .', { stdio: 'ignore' });
        execSync('git commit -m "Initial commit: FHEVM example project"', { stdio: 'ignore' });
        log(`  ✓ Git repository initialized`, 'green');
    } catch (error) {
        log(`  ⚠ Failed to initialize git: ${error}`, 'yellow');
    }
}

/**
 * Main function to create FHEVM example
 */
async function createFhevmExample(): Promise<void> {
    printHeader('🚀 FHEVM Example Generator');

    // Parse command line arguments
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: ts-node scripts/create-fhevm-example.ts <output-directory> [example-name]');
        console.log('\nAvailable examples:');
        Object.keys(EXAMPLES).forEach(key => {
            console.log(`  - ${key}: ${EXAMPLES[key].description}`);
        });
        console.log('\nExample:');
        console.log('  ts-node scripts/create-fhevm-example.ts ../my-fhevm-project');
        process.exit(0);
    }

    const outputDir = path.resolve(args[0]);
    const exampleName = args[1] || 'private-organ-matching';

    // Get example configuration
    const config = EXAMPLES[exampleName];
    if (!config) {
        log(`❌ Error: Unknown example "${exampleName}"`, 'red');
        log('\nAvailable examples:', 'yellow');
        Object.keys(EXAMPLES).forEach(key => {
            console.log(`  - ${key}`);
        });
        process.exit(1);
    }

    log(`Creating FHEVM example: ${colors.bright}${config.name}${colors.reset}`, 'cyan');
    log(`Output directory: ${outputDir}`, 'blue');
    console.log();

    // Check output directory
    if (!checkDirectory(outputDir)) {
        process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const currentDir = process.cwd();

    // Step 1: Copy contract files
    log('📄 Copying contract files...', 'cyan');
    copyFile(
        path.join(currentDir, config.contractFile),
        path.join(outputDir, 'contracts', path.basename(config.contractFile))
    );

    // Step 2: Copy test files
    log('\n🧪 Copying test files...', 'cyan');
    copyFile(
        path.join(currentDir, config.testFile),
        path.join(outputDir, 'test', path.basename(config.testFile))
    );

    // Step 3: Copy deployment script
    log('\n📦 Copying deployment scripts...', 'cyan');
    copyFile(
        path.join(currentDir, 'scripts/deploy.ts'),
        path.join(outputDir, 'scripts/deploy.ts')
    );

    // Step 4: Copy configuration files
    log('\n⚙️  Copying configuration files...', 'cyan');
    const configFiles = [
        'hardhat.config.ts',
        'tsconfig.json',
        'package.json'
    ];

    configFiles.forEach(file => {
        copyFile(
            path.join(currentDir, file),
            path.join(outputDir, file)
        );
    });

    // Step 5: Generate project files
    log('\n📝 Generating project files...', 'cyan');
    generateReadme(outputDir, config);
    createGitignore(outputDir);
    createEnvExample(outputDir);

    // Step 6: Update package.json
    log('\n🔧 Updating project configuration...', 'cyan');
    updatePackageJson(outputDir, config);

    // Step 7: Initialize git repository
    log('\n🌿 Initializing git repository...', 'cyan');
    initGitRepo(outputDir);

    // Success message
    printHeader('✅ FHEVM Example Created Successfully!');

    log('Next steps:', 'bright');
    console.log(`
  1. Navigate to the project directory:
     ${colors.cyan}cd ${outputDir}${colors.reset}

  2. Install dependencies:
     ${colors.cyan}npm install${colors.reset}

  3. Compile contracts:
     ${colors.cyan}npm run compile${colors.reset}

  4. Run tests:
     ${colors.cyan}npm test${colors.reset}

  5. Deploy locally:
     ${colors.cyan}npm run dev${colors.reset}      ${colors.yellow}# Terminal 1${colors.reset}
     ${colors.cyan}npm run deploy${colors.reset}   ${colors.yellow}# Terminal 2${colors.reset}
`);

    log('📚 Resources:', 'bright');
    console.log(`
  - README.md: Project overview and usage
  - Contract: ${config.contractFile}
  - Tests: ${config.testFile}
  - FHEVM Docs: https://docs.zama.ai/fhevm
`);

    log('Happy coding! 🎉', 'green');
}

// Run the script
createFhevmExample().catch((error) => {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
});
