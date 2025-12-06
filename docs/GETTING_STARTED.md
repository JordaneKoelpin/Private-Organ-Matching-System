# Getting Started with Private Organ Matching

Welcome! This guide will help you set up and run the Private Organ Matching FHEVM example on your local machine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Compilation](#compilation)
5. [Testing](#testing)
6. [Local Deployment](#local-deployment)
7. [Testnet Deployment](#testnet-deployment)
8. [Contract Interaction](#contract-interaction)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** for cloning
- **Code Editor** (VS Code recommended)
- **Web3 Wallet** (MetaMask, WalletConnect, etc.)
- **Testnet ETH** (for Sepolia deployment)

### Check Your Setup

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Verify git is installed
git --version
```

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd PrivacyOrganMatching
```

### Step 2: Install Dependencies

```bash
npm install
```

This command will install approximately 25 development dependencies:

- **Hardhat** - Development environment
- **FHEVM** - Homomorphic encryption library
- **TypeScript** - Language support
- **Chai** & **Mocha** - Testing framework
- **Ethers.js** - Ethereum interaction
- **Solhint** - Solidity linter

Installation typically takes 2-3 minutes.

**Verify installation:**

```bash
npx hardhat --version
# Expected: 2.19.5 or compatible
```

## Configuration

### Step 1: Create Environment File

```bash
cp .env.example .env
```

### Step 2: Edit .env File

Open `.env` in your editor and configure:

```bash
# RPC Endpoint for Sepolia testnet
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com

# Your wallet private key (DO NOT share!)
# To get: MetaMask → Account Details → Export Private Key
PRIVATE_KEY=your_private_key_without_0x_prefix

# For contract verification on Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Enable gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=optional_for_gas_reporting
```

### ⚠️ Security Guidelines

**Never commit your `.env` file!**

The `.gitignore` already protects it, but remember:

- 🔒 Keep private keys secret
- 🔐 Don't share .env files
- 🚫 Never push credentials to GitHub
- 💾 Backup your private keys safely

### Getting Test ETH

You'll need Sepolia testnet ETH for deployment:

1. **Sepolia Faucet**: https://sepoliafaucet.com/
2. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia
3. **Alchemy Faucet**: https://www.alchemy.com/faucets/ethereum-sepolia

Request 0.5 ETH to start (costs are minimal on testnet).

## Compilation

### Compile Smart Contracts

```bash
npm run compile
```

**Expected output:**

```
Compiling 1 Solidity file successfully
contracts/PrivateOrganMatching.sol compiled successfully

Generated 1 typechain files
```

This creates:
- Compiled contract ABI
- TypeScript type definitions
- Build artifacts

### Troubleshooting Compilation

**Error**: `SyntaxError: Unexpected token`

```bash
# Clean and rebuild
npm run clean
npm run compile
```

**Error**: `Cannot find module @fhevm`

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Testing

### Run All Tests

```bash
npm test
```

**Expected output:**

```
PrivateOrganMatching
  Contract Initialization
    ✓ Should set hospital address as deployer (42ms)
    ✓ Should initialize totalMatches to 0 (28ms)
    ✓ Should return correct initial system stats (35ms)
  Donor Registration
    ✓ Should register donor with valid data (78ms)
    ✓ Should reject donor under 18 years old (45ms)
    ✓ Should reject donor over 80 years old (38ms)
    ...

  40 passing (5s)
```

### Run Specific Test Suite

```bash
# Run only donor registration tests
npx hardhat test --grep "Donor Registration"

# Run only matching tests
npx hardhat test --grep "Matching Operations"
```

### Test with Gas Report

```bash
npm test -- --reporter-file gas-report
```

This generates a `gas-report` with gas usage statistics.

## Local Deployment

### Start Local Hardhat Network

**Terminal 1: Start the network**

```bash
npm run dev
```

Output:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts (10 available):
Account #0: 0x... (10000 ETH)
Account #1: 0x... (10000 ETH)
...
```

Keep this terminal running.

### Deploy Contract Locally

**Terminal 2: Deploy the contract**

```bash
npm run deploy
```

**Expected output:**

```
🚀 Starting deployment of PrivateOrganMatching contract...

📋 Deployment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deploying from: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000.0 ETH
Network: hardhat (Chain ID: 1337)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract address: 0x...
Transaction hash: 0x...
Block number: 1
Gas used: 1234567
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Deployment info saved to: ./deployments/hardhat-1337.json
✨ Deployment complete!
```

Save the contract address for later use.

## Testnet Deployment

### Prerequisites

- ✅ Sepolia testnet ETH in your wallet (0.1 ETH minimum)
- ✅ ETHERSCAN_API_KEY in .env file
- ✅ PRIVATE_KEY configured in .env

### Deploy to Sepolia

```bash
npm run deploy:sepolia
```

**Initial wait**: First deployment may take 1-2 minutes as it waits for confirmations.

**Output:**

```
🚀 Starting deployment of PrivateOrganMatching contract...

📋 Deployment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deploying from: 0x...
Account balance: 0.45 ETH
Network: sepolia (Chain ID: 11155111)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract deployed successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract address: 0x...
Transaction hash: 0x...
Block number: 12345
Gas used: 1234567
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 To verify the contract on Etherscan, run:
npx hardhat verify --network sepolia 0x...
```

### Verify Contract on Etherscan

After deployment, verify your contract:

```bash
npm run verify -- --network sepolia <YOUR_CONTRACT_ADDRESS>
```

**After verification**, you can view the contract on Etherscan at:

```
https://sepolia.etherscan.io/address/<YOUR_CONTRACT_ADDRESS>
```

## Contract Interaction

### Option 1: Hardhat Console

Interactive JavaScript environment for contract interaction:

```bash
npx hardhat console --network hardhat
```

**Example interactions:**

```javascript
// Get contract
const Contract = await ethers.getContractFactory("PrivateOrganMatching");
const contract = Contract.attach("0x...");

// Register a donor
const tx = await contract.registerDonor(35, 0, 2, 150, 50);
await tx.wait();

// Check active donors
const donorsCount = await contract.getActiveDonorsCount();
console.log("Active donors:", donorsCount.toString());

// Get system stats
const stats = await contract.getSystemStats();
console.log("Donors:", stats.totalDonors.toString());
console.log("Recipients:", stats.totalRecipients.toString());
```

### Option 2: Web Interface

The project includes a web interface for interaction:

```bash
# Install http-server
npm install -g http-server

# Serve from project root
http-server

# Open http://localhost:8080 in browser
```

Then:
1. Connect MetaMask to your network
2. Interact with the UI to register donors/recipients
3. View system statistics

### Option 3: Ethers.js Script

Create a script file (e.g., `interact.ts`):

```typescript
import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0x..."; // Your deployed contract
    const abi = [...]; // Contract ABI

    const provider = ethers.provider;
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Register donor
    const tx = await contract.registerDonor(35, 0, 2, 150, 50);
    console.log("Transaction:", tx.hash);
    await tx.wait();
    console.log("Donation registered!");
}

main().catch(console.error);
```

Run it:

```bash
npx ts-node interact.ts
```

## Troubleshooting

### Installation Issues

#### Problem: `npm install` fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

#### Problem: `node-gyp` rebuild errors

```bash
# Install build tools (macOS)
xcode-select --install

# Install build tools (Windows)
npm install --global windows-build-tools

# Retry installation
npm install
```

### Compilation Issues

#### Problem: `@fhevm/solidity not found`

```bash
# Ensure correct installation
npm install @fhevm/solidity

# Clear hardhat cache
npm run clean

# Recompile
npm run compile
```

#### Problem: Solidity version mismatch

```
Error: Source file requires different compiler version
```

**Fix**: Update `hardhat.config.ts`:

```typescript
solidity: {
  version: "0.8.24",  // Match your contract pragma
}
```

### Testing Issues

#### Problem: Tests timeout

```bash
# Increase timeout (in test file)
this.timeout(120000); // 2 minutes
```

#### Problem: Out of memory during tests

```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm test
```

### Deployment Issues

#### Problem: "insufficient funds for gas"

```
Error: insufficient funds for gas * price + value
```

**Solutions:**
- Get more testnet ETH from faucet
- Reduce gas price in network config
- Check account has ETH on correct network

#### Problem: "invalid nonce"

```
Error: nonce too high
```

**Solution**: Reset MetaMask account

1. Open MetaMask
2. Settings → Advanced
3. Clear Activity Tab Data
4. Retry deployment

#### Problem: Network timeout

```
Error: getaddrinfo ENOTFOUND <network-url>
```

**Solutions:**
- Check internet connection
- Verify RPC URL in .env
- Try different RPC endpoint

### Contract Interaction Issues

#### Problem: "Call reverted"

```
Error: call revert: Only authorized hospital
```

**Solution**: Ensure you're using the correct account (deployer is hospital).

#### Problem: "Already registered as donor"

```
Error: Already registered as donor
```

**Solution**: Use a different account, or deactivate first.

## Next Steps

Now that you're set up, explore:

1. **Read the Contract**: Study `contracts/PrivateOrganMatching.sol`
2. **Explore Tests**: Review `test/PrivateOrganMatching.test.ts`
3. **Learn FHEVM**: Read inline documentation and comments
4. **Modify Code**: Try adding new features
5. **Deploy**: Deploy to testnet and verify

## Development Workflow

```bash
# 1. Make code changes
vim contracts/PrivateOrganMatching.sol

# 2. Compile
npm run compile

# 3. Test
npm test

# 4. Deploy locally
npm run dev &        # Terminal 1
npm run deploy       # Terminal 2

# 5. Deploy to testnet
npm run deploy:sepolia

# 6. Verify
npm run verify -- --network sepolia 0x...
```

## Getting Help

- 📖 [Full README](../README.md)
- 📚 [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- 💬 [Zama Discord](https://discord.com/invite/fhe-org)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

## Best Practices

### Security

- 🔒 Never commit `.env` file
- 🔐 Keep private keys secret
- ✅ Always verify contracts before using
- 🚫 Don't use real private keys on public networks

### Development

- 🧪 Always run tests before deploying
- 📝 Comment your code changes
- ♻️ Reuse existing patterns
- 🔄 Version control everything

### Gas Efficiency

- 💰 Check gas costs regularly
- 📊 Monitor gas usage trends
- ⚡ Optimize expensive operations
- 🎯 Target reasonable gas limits

## Common Commands

```bash
# Compilation
npm run compile         # Compile contracts
npm run clean          # Clean build artifacts

# Testing
npm test               # Run all tests
npm test -- --grep "pattern"  # Run specific tests

# Deployment
npm run dev            # Start local network
npm run deploy         # Deploy to local
npm run deploy:sepolia # Deploy to Sepolia

# Verification
npm run verify -- --network sepolia <ADDRESS>

# Utilities
npm run lint           # Check code style
npm run format         # Format code
npm run generate:docs  # Generate documentation
```

---

**You're all set!** Happy developing with FHEVM! 🚀
