import * as fs from "fs";
import * as path from "path";

/**
 * Documentation Generator Script
 *
 * This script generates comprehensive documentation from:
 * - Contract source code
 * - Test files with TSDoc comments
 * - Project configuration
 *
 * Output: Markdown files compatible with GitBook
 */

interface DocSection {
    title: string;
    content: string;
}

/**
 * Extract FHEVM patterns from contract source code
 */
function extractFHEVMPatterns(sourceCode: string): string[] {
    const patterns: string[] = [];
    const patternRegex = /@custom:fhevm-pattern\s+(.+)/g;
    let match;

    while ((match = patternRegex.exec(sourceCode)) !== null) {
        patterns.push(match[1].trim());
    }

    return [...new Set(patterns)]; // Remove duplicates
}

/**
 * Extract test descriptions from test file
 */
function extractTestDescriptions(testCode: string): DocSection[] {
    const sections: DocSection[] = [];
    const describeRegex = /describe\("([^"]+)",[\s\S]*?\{([\s\S]*?)(?=\n\s*describe\(|$)/g;
    let match;

    while ((match = describeRegex.exec(testCode)) !== null) {
        const title = match[1];
        const content = match[2];

        // Extract test cases
        const itRegex = /it\("([^"]+)"/g;
        const tests: string[] = [];
        let testMatch;

        while ((testMatch = itRegex.exec(content)) !== null) {
            tests.push(testMatch[1]);
        }

        if (tests.length > 0) {
            sections.push({
                title,
                content: tests.map(t => `- ${t}`).join("\n"),
            });
        }
    }

    return sections;
}

/**
 * Generate main README documentation
 */
function generateReadme(): string {
    const contractPath = path.join(__dirname, "../contracts/PrivateOrganMatching.sol");
    const testPath = path.join(__dirname, "../test/PrivateOrganMatching.test.ts");

    const contractCode = fs.readFileSync(contractPath, "utf-8");
    const testCode = fs.readFileSync(testPath, "utf-8");

    const fhevmPatterns = extractFHEVMPatterns(contractCode);
    const testSections = extractTestDescriptions(testCode);

    return `# Private Organ Matching - FHEVM Example

[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **Zama Bounty Track - December 2025**
> A comprehensive example of privacy-preserving healthcare applications using FHEVM

## 📋 Overview

Private Organ Matching is a secure, privacy-preserving organ donor-recipient matching system built on FHEVM (Fully Homomorphic Encryption Virtual Machine). This project demonstrates how to handle sensitive medical data on blockchain while maintaining complete privacy through encryption.

## 🎯 FHEVM Concepts Demonstrated

This example showcases multiple FHEVM patterns and concepts:

${fhevmPatterns.map(p => `- ${p}`).join("\n")}

## 🏥 Use Case: Organ Matching

The contract enables:

1. **Donor Registration**: Individuals can register as organ donors with encrypted medical information
2. **Recipient Registration**: Patients waiting for transplants register their medical needs privately
3. **Privacy-Preserving Matching**: Hospital coordinators match donors and recipients without seeing raw medical data
4. **Compatibility Scoring**: Encrypted computation calculates compatibility based on:
   - Blood type compatibility (30 points)
   - Organ type match (40 points)
   - Age compatibility (15 points)
   - HLA tissue compatibility (10 points)
   - Medical urgency bonus (up to 25 points)
   - Waiting time bonus (up to 15 points)

## 🛠️ Technical Stack

- **Smart Contracts**: Solidity 0.8.24
- **Testing**: Hardhat + TypeScript + Chai
- **Encryption**: Zama FHEVM (@fhevm/solidity)
- **Network**: Ethereum Sepolia Testnet / Zama DevNet

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd PrivacyOrganMatching

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your .env file with:
# - SEPOLIA_RPC_URL
# - PRIVATE_KEY
# - ETHERSCAN_API_KEY (for verification)
\`\`\`

## 🚀 Quick Start

### Compile Contracts

\`\`\`bash
npm run compile
\`\`\`

### Run Tests

\`\`\`bash
npm test
\`\`\`

### Deploy Contract

\`\`\`bash
# Deploy to local Hardhat network
npm run deploy

# Deploy to Sepolia testnet
npm run deploy:sepolia
\`\`\`

### Verify Contract

\`\`\`bash
npm run verify -- --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## 📚 Contract API

### Registration Functions

#### \`registerDonor(age, bloodType, organType, hlaType, urgencyScore)\`

Register as an organ donor with encrypted medical data.

**Parameters:**
- \`age\` (uint8): Donor age (18-80)
- \`bloodType\` (uint8): Blood type (0=O, 1=A, 2=B, 3=AB)
- \`organType\` (uint8): Organ to donate (0-5)
- \`hlaType\` (uint16): HLA compatibility marker
- \`urgencyScore\` (uint8): Medical urgency (0-100)

#### \`registerRecipient(age, bloodType, organType, hlaType, urgencyScore, waitTime)\`

Register as an organ recipient with encrypted medical data.

**Additional Parameter:**
- \`waitTime\` (uint8): Months on waiting list (0-240)

### Matching Functions

#### \`initiateMatching(donor, recipient)\`

Initiate encrypted compatibility matching between a donor and recipient. Only callable by the hospital coordinator.

### Profile Management

#### \`updateUrgencyScore(newScore)\`

Update urgency score for emergency situations (recipients only).

#### \`deactivateProfile(isDonor)\`

Deactivate donor or recipient profile.

### View Functions

#### \`getMatchResult(matchId)\`

Query match result by ID.

#### \`getSystemStats()\`

Get comprehensive system statistics.

#### \`getActiveDonorsCount()\` / \`getActiveRecipientsCount()\`

Get count of active profiles.

## 🧪 Test Coverage

${testSections.map(section => `
### ${section.title}

${section.content}
`).join("\n")}

## 🔐 Security Considerations

1. **Data Privacy**: All medical information is encrypted on-chain using FHEVM
2. **Access Control**: Only authorized parties can access encrypted data
3. **Hospital Authority**: Matching operations restricted to authorized coordinator
4. **Profile Ownership**: Users control their own profiles and data

## 📊 Gas Optimization

- Efficient storage patterns with struct packing
- Swap-and-pop for array operations
- Minimal storage reads in loops
- Optimized encrypted operations

## 🌐 Network Configuration

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC**: https://ethereum-sepolia.publicnode.com
- **Explorer**: https://sepolia.etherscan.io

### Zama DevNet

- **Chain ID**: 8009
- **RPC**: https://devnet.zama.ai
- **Docs**: https://docs.zama.ai/fhevm

## 📖 Learning Resources

### FHEVM Documentation

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Solidity Library](https://github.com/zama-ai/fhevm)
- [FHE Operations Reference](https://docs.zama.ai/fhevm/fundamentals/operations)

### Key FHEVM Patterns in This Example

#### 1. Encrypting Data

\`\`\`solidity
euint8 encryptedAge = FHE.asEuint8(_age);
euint16 encryptedHLA = FHE.asEuint16(_hlaType);
\`\`\`

#### 2. Access Control

\`\`\`solidity
FHE.allowThis(encryptedAge);     // Contract can use it
FHE.allow(encryptedAge, user);    // User can decrypt it
\`\`\`

#### 3. Encrypted Arithmetic

\`\`\`solidity
euint8 sum = FHE.add(value1, value2);
euint8 diff = FHE.sub(value1, value2);
\`\`\`

#### 4. Encrypted Comparisons

\`\`\`solidity
ebool isEqual = FHE.eq(value1, value2);
ebool isLess = FHE.lt(value1, value2);
\`\`\`

#### 5. Conditional Selection

\`\`\`solidity
euint8 result = FHE.select(condition, trueValue, falseValue);
\`\`\`

#### 6. Public Decryption

\`\`\`solidity
bytes32[] memory cts = new bytes32[](1);
cts[0] = FHE.toBytes32(encryptedScore);
FHE.requestDecryption(cts, callback, requestId);
\`\`\`

## 🎥 Demo Video

[Link to demonstration video - Required for Zama Bounty submission]

The demo video covers:
- Contract deployment process
- Donor and recipient registration
- Initiating matching process
- Viewing encrypted and decrypted results
- Code walkthrough of key FHEVM patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Zama Bounty Submission

This project is submitted for the **Zama Bounty Track - December 2025**

**Category**: Healthcare Privacy
**FHEVM Features**: Encrypted storage, encrypted computation, access control, public decryption
**Complexity**: Intermediate

### Highlights

- ✅ Standalone Hardhat project with full documentation
- ✅ Comprehensive test suite with 40+ test cases
- ✅ Production-ready deployment scripts
- ✅ Real-world healthcare use case
- ✅ Multiple FHEVM patterns demonstrated
- ✅ Complete inline documentation
- ✅ GitBook-compatible documentation

## 📧 Contact

For questions about this example or FHEVM development:

- [Zama Discord](https://discord.com/invite/fhe-org)
- [Zama Documentation](https://docs.zama.ai/)
- [GitHub Issues](../../issues)

---

**Built with ❤️ using Zama FHEVM**
`;
}

/**
 * Generate Getting Started guide
 */
function generateGettingStarted(): string {
    return `# Getting Started with Private Organ Matching

This guide will help you set up and run the Private Organ Matching example on your local machine.

## Prerequisites

Before you begin, ensure you have:

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- A code editor (VS Code recommended)
- MetaMask or similar Web3 wallet

## Step 1: Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd PrivacyOrganMatching

# Install dependencies
npm install
\`\`\`

This will install:
- Hardhat and testing framework
- FHEVM Solidity library
- TypeScript and type definitions
- Development tools

## Step 2: Environment Configuration

Create your \`.env\` file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and add your credentials:

\`\`\`bash
# For Sepolia deployment
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
PRIVATE_KEY=your_private_key_without_0x

# For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_api_key
\`\`\`

⚠️ **Security Warning**: Never commit your \`.env\` file or share your private keys!

## Step 3: Compile the Contract

\`\`\`bash
npm run compile
\`\`\`

This compiles the Solidity contracts and generates TypeScript types.

Expected output:
\`\`\`
Compiled 1 Solidity file successfully
Generated 1 typechain files
\`\`\`

## Step 4: Run Tests

\`\`\`bash
npm test
\`\`\`

This runs the complete test suite with:
- 40+ test cases
- Contract initialization tests
- Registration validation
- Matching operations
- Access control checks
- Edge case handling

All tests should pass ✅

## Step 5: Local Deployment

Start a local Hardhat node:

\`\`\`bash
npm run dev
\`\`\`

In a new terminal, deploy locally:

\`\`\`bash
npm run deploy
\`\`\`

The contract will be deployed to your local Hardhat network at \`http://127.0.0.1:8545\`.

## Step 6: Testnet Deployment

To deploy to Sepolia testnet:

\`\`\`bash
npm run deploy:sepolia
\`\`\`

After deployment, you'll see:
- Contract address
- Transaction hash
- Verification command

## Step 7: Verify Contract

Verify your contract on Etherscan:

\`\`\`bash
npm run verify -- --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## Step 8: Interact with Contract

### Using Hardhat Console

\`\`\`bash
npx hardhat console --network sepolia
\`\`\`

\`\`\`javascript
const Contract = await ethers.getContractFactory("PrivateOrganMatching");
const contract = Contract.attach("YOUR_CONTRACT_ADDRESS");

// Check system stats
const stats = await contract.getSystemStats();
console.log("Active Donors:", stats.totalDonors.toString());
\`\`\`

### Using Frontend

The project includes a web interface:

\`\`\`bash
# Serve the frontend
npx serve .
\`\`\`

Open \`http://localhost:3000\` and connect your MetaMask wallet.

## Common Issues

### Issue: "Invalid nonce"

**Solution**: Reset your MetaMask account:
- Settings → Advanced → Clear Activity Tab Data

### Issue: "Insufficient funds"

**Solution**: Get test ETH from Sepolia faucet:
- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

### Issue: "Contract not deployed"

**Solution**: Check your RPC URL and ensure the contract deployed successfully.

## Next Steps

Now that you're set up, explore:

1. **Read the Contract**: Review \`contracts/PrivateOrganMatching.sol\`
2. **Study Tests**: Check \`test/PrivateOrganMatching.test.ts\`
3. **Learn FHEVM**: Read the inline documentation
4. **Modify & Experiment**: Try adding new features

## Development Workflow

\`\`\`bash
# Make changes to contract
vim contracts/PrivateOrganMatching.sol

# Compile
npm run compile

# Run tests
npm test

# Deploy to testnet
npm run deploy:sepolia

# Verify
npm run verify -- --network sepolia <ADDRESS>
\`\`\`

## Getting Help

- 📖 [Full Documentation](./README.md)
- 💬 [Zama Discord](https://discord.com/invite/fhe-org)
- 📘 [FHEVM Docs](https://docs.zama.ai/fhevm)
- 🐛 [Report Issues](../../issues)

Happy coding! 🚀
`;
}

/**
 * Main function to generate all documentation
 */
async function main() {
    console.log("📝 Generating documentation...\n");

    const docsDir = path.join(__dirname, "../docs");

    // Create docs directory if it doesn't exist
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    // Generate README
    console.log("✅ Generating README.md...");
    const readme = generateReadme();
    fs.writeFileSync(path.join(__dirname, "../README.md"), readme);

    // Generate Getting Started
    console.log("✅ Generating GETTING_STARTED.md...");
    const gettingStarted = generateGettingStarted();
    fs.writeFileSync(path.join(docsDir, "GETTING_STARTED.md"), gettingStarted);

    console.log("\n✨ Documentation generated successfully!");
    console.log("\nGenerated files:");
    console.log("- README.md");
    console.log("- docs/GETTING_STARTED.md");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error generating documentation:");
        console.error(error);
        process.exit(1);
    });
