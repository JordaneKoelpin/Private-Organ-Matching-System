# Developer Guide: Private Organ Matching

## Overview

This guide is for developers who want to extend, modify, or learn from the Private Organ Matching smart contract example. Whether you're building upon this codebase or using it as a reference for your own FHEVM projects, this document will help you understand the architecture and development patterns.

## Table of Contents

- [Project Architecture](#project-architecture)
- [FHEVM Patterns](#fhevm-patterns)
- [Extending the Contract](#extending-the-contract)
- [Adding New Features](#adding-new-features)
- [Testing Strategies](#testing-strategies)
- [Deployment Best Practices](#deployment-best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Project Architecture

### Contract Structure

The `PrivateOrganMatching.sol` contract follows a modular architecture:

```solidity
contract PrivateOrganMatching is SepoliaConfig {
    // State Variables
    // Enums & Structs
    // Storage Mappings
    // Events
    // Modifiers
    // Constructor
    // Public Functions
    // Internal Functions
    // View Functions
}
```

### Key Components

1. **Encrypted Profiles** (`DonorProfile` & `RecipientProfile`)
   - Store all sensitive medical data encrypted
   - Use `euint8` and `euint16` types for different data ranges
   - Include metadata (timestamps, addresses, active status)

2. **Matching System** (`MatchResult`)
   - Tracks matching processes
   - Stores decrypted compatibility scores
   - Records success/failure status

3. **Access Control**
   - Hospital coordinator role
   - Profile ownership validation
   - Registration status checks

## FHEVM Patterns

### Pattern 1: Encrypting User Input

**When to use**: Converting plaintext user input to encrypted on-chain storage.

```solidity
function registerDonor(uint8 _age, ...) external {
    // Encrypt the plaintext value
    euint8 encryptedAge = FHE.asEuint8(_age);

    // Store encrypted value
    donors[msg.sender].encryptedAge = encryptedAge;

    // Grant permissions
    FHE.allowThis(encryptedAge);      // Contract can use in computations
    FHE.allow(encryptedAge, msg.sender); // User can decrypt
}
```

**Important**: Always grant both `allowThis` and `allow` permissions.

### Pattern 2: Encrypted Arithmetic

**When to use**: Performing calculations on encrypted values.

```solidity
// Addition
euint8 total = FHE.add(value1, value2);

// Subtraction
euint8 difference = FHE.sub(value1, value2);

// Bit shifting (efficient division/multiplication by powers of 2)
euint8 half = FHE.shr(value, 1);     // Divide by 2
euint8 quarter = FHE.shr(value, 2);  // Divide by 4
```

**Note**: Bit shifting is gas-efficient for division/multiplication by powers of 2.

### Pattern 3: Encrypted Comparisons

**When to use**: Comparing encrypted values without decryption.

```solidity
// Equality check
ebool isEqual = FHE.eq(value1, value2);

// Greater than
ebool isGreater = FHE.gt(value1, value2);

// Less than or equal
ebool isLessOrEqual = FHE.le(value1, value2);
```

**Available operators**: `eq`, `ne`, `lt`, `le`, `gt`, `ge`

### Pattern 4: Conditional Logic

**When to use**: Implementing if/else logic on encrypted values.

```solidity
// Select between two values based on encrypted condition
euint8 result = FHE.select(
    condition,           // ebool: encrypted condition
    valueIfTrue,        // euint8: value if condition is true
    valueIfFalse        // euint8: value if condition is false
);

// Example: Award points if blood types match
euint8 points = FHE.select(
    FHE.eq(donorBlood, recipientBlood),
    FHE.asEuint8(30),   // 30 points if match
    FHE.asEuint8(0)     // 0 points otherwise
);
```

### Pattern 5: Public Decryption

**When to use**: Revealing computed results while keeping intermediate values secret.

```solidity
// Step 1: Request decryption
bytes32[] memory cts = new bytes32[](1);
cts[0] = FHE.toBytes32(encryptedResult);

FHE.requestDecryption(
    cts,                                    // Encrypted values to decrypt
    this.callbackFunction.selector,         // Callback function
    requestId                               // Request identifier
);

// Step 2: Handle decrypted result
function callbackFunction(
    uint256 requestId,
    uint8 decryptedValue,
    bytes[] memory signatures
) external {
    // Verify signatures in production
    require(signatures.length > 0, "Invalid signatures");

    // Use decrypted value
    results[requestId] = decryptedValue;
}
```

**Important**: In production, always verify cryptographic signatures.

## Extending the Contract

### Adding New Medical Factors

To add new compatibility factors (e.g., weight, height):

1. **Update Structs**:
```solidity
struct DonorProfile {
    // Existing fields...
    euint8 encryptedWeight;  // Add new encrypted field
}
```

2. **Update Registration Function**:
```solidity
function registerDonor(
    uint8 _age,
    // ... existing params
    uint8 _weight  // Add new parameter
) external {
    euint8 encryptedWeight = FHE.asEuint8(_weight);

    donors[msg.sender].encryptedWeight = encryptedWeight;

    FHE.allowThis(encryptedWeight);
    FHE.allow(encryptedWeight, msg.sender);
}
```

3. **Update Matching Algorithm**:
```solidity
function _calculateBaseScore(
    DonorProfile storage donor,
    RecipientProfile storage recipient
) private returns (euint8) {
    // Existing logic...

    // Add weight compatibility check (±10kg acceptable)
    ebool weightDiffValid = FHE.le(
        _calculateAbsDiff(donor.encryptedWeight, recipient.encryptedWeight),
        FHE.asEuint8(10)
    );

    score = FHE.add(score, FHE.select(
        weightDiffValid,
        FHE.asEuint8(5),  // 5 bonus points for weight compatibility
        FHE.asEuint8(0)
    ));

    return score;
}
```

4. **Add Tests**:
```typescript
it("Should award weight compatibility bonus", async function () {
    await contract.connect(donor1).registerDonor(
        35, 0, 2, 150, 50, 70  // weight: 70kg
    );

    await contract.connect(recipient1).registerRecipient(
        30, 0, 2, 140, 75, 12, 75  // weight: 75kg
    );

    await contract.connect(hospital).initiateMatching(
        donor1.address,
        recipient1.address
    );

    // Expect higher score due to weight compatibility
});
```

### Adding Multi-Organ Support

To allow donors to offer multiple organs:

1. **Update Storage**:
```solidity
struct DonorProfile {
    // ... existing fields
    mapping(uint8 => bool) availableOrgans;  // Track multiple organs
}
```

2. **Update Registration**:
```solidity
function registerMultiOrganDonor(
    uint8 _age,
    uint8 _bloodType,
    uint8[] memory _organTypes,  // Array of organs
    uint16 _hlaType,
    uint8 _urgencyScore
) external {
    // Validate and store each organ
    for (uint i = 0; i < _organTypes.length; i++) {
        require(_organTypes[i] <= 5, "Invalid organ type");
        donors[msg.sender].availableOrgans[_organTypes[i]] = true;
    }
}
```

### Adding Time-Based Priority

To give priority to longer wait times:

1. **Update Recipient Struct**:
```solidity
struct RecipientProfile {
    // ... existing fields
    uint256 registrationTime;  // Already exists
}
```

2. **Calculate Wait Time Bonus**:
```solidity
function _addBonusScores(
    euint8 baseScore,
    RecipientProfile storage recipient
) private returns (euint8) {
    // Calculate days waiting
    uint256 daysWaiting = (block.timestamp - recipient.registrationTime) / 1 days;

    // Add bonus: 1 point per 30 days (max 20 points)
    uint8 waitBonus = uint8(daysWaiting / 30);
    if (waitBonus > 20) waitBonus = 20;

    euint8 bonusPoints = FHE.asEuint8(waitBonus);
    return FHE.add(baseScore, bonusPoints);
}
```

## Adding New Features

### Feature: Emergency Priority Override

```solidity
// Add to contract
mapping(address => bool) public emergencyRecipients;

function setEmergencyPriority(address _recipient, bool _isEmergency)
    external
    onlyHospital
{
    require(recipients[_recipient].isActive, "Not registered");
    emergencyRecipients[_recipient] = _isEmergency;
    emit EmergencyStatusUpdated(_recipient, _isEmergency);
}

function _addBonusScores(...) private returns (euint8) {
    // Add emergency bonus
    if (emergencyRecipients[recipient.recipientAddress]) {
        baseScore = FHE.add(baseScore, FHE.asEuint8(50));  // +50 emergency bonus
    }
    // ... rest of function
}
```

### Feature: Geographic Location Matching

```solidity
struct DonorProfile {
    // ... existing fields
    euint8 encryptedRegionCode;  // Encrypted geographic region
}

function _calculateBaseScore(...) private returns (euint8) {
    // Award bonus for same region (faster transport)
    ebool sameRegion = FHE.eq(
        donor.encryptedRegionCode,
        recipient.encryptedRegionCode
    );

    score = FHE.add(score, FHE.select(
        sameRegion,
        FHE.asEuint8(10),  // +10 for local match
        FHE.asEuint8(0)
    ));
}
```

## Testing Strategies

### Unit Testing FHEVM Contracts

```typescript
describe("Encrypted Operations", function () {
    it("Should correctly compare encrypted blood types", async function () {
        // Register two profiles with same blood type
        await contract.connect(donor1).registerDonor(35, 1, 2, 150, 50);
        await contract.connect(recipient1).registerRecipient(30, 1, 2, 140, 75, 12);

        // Initiate match
        await contract.connect(hospital).initiateMatching(
            donor1.address,
            recipient1.address
        );

        // Wait for decryption callback
        // ... expect high compatibility score
    });
});
```

### Testing Edge Cases

```typescript
describe("Edge Cases", function () {
    it("Should handle maximum values correctly", async function () {
        // Test with boundary values
        await contract.connect(donor1).registerDonor(
            80,    // Max age
            3,     // Max blood type (AB)
            5,     // Max organ type
            65535, // Max HLA (uint16 max)
            100    // Max urgency
        );
    });

    it("Should reject invalid inputs", async function () {
        await expect(
            contract.connect(donor1).registerDonor(17, 0, 0, 0, 0)
        ).to.be.revertedWith("Invalid age range");
    });
});
```

### Testing Access Control

```typescript
describe("Access Control", function () {
    it("Should prevent non-hospital from initiating match", async function () {
        await expect(
            contract.connect(donor1).initiateMatching(
                donor1.address,
                recipient1.address
            )
        ).to.be.revertedWith("Only authorized hospital");
    });
});
```

## Deployment Best Practices

### Pre-Deployment Checklist

- ✅ All tests passing
- ✅ Gas optimization complete
- ✅ Security audit performed
- ✅ Access control verified
- ✅ Events properly emitted
- ✅ Documentation updated

### Deployment Script Template

```typescript
async function main() {
    // 1. Verify network
    const network = await ethers.provider.getNetwork();
    console.log(`Deploying to ${network.name} (${network.chainId})`);

    // 2. Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Balance: ${await deployer.getBalance()}`);

    // 3. Deploy contract
    const Contract = await ethers.getContractFactory("PrivateOrganMatching");
    const contract = await Contract.deploy();
    await contract.deployed();

    console.log(`Contract deployed to: ${contract.address}`);

    // 4. Verify deployment
    console.log(`Hospital: ${await contract.hospital()}`);

    // 5. Save deployment info
    const deployment = {
        network: network.name,
        address: contract.address,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
        `deployments/${network.name}.json`,
        JSON.stringify(deployment, null, 2)
    );
}
```

### Post-Deployment Verification

```bash
# Verify contract on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>

# Test basic functionality
npx hardhat run scripts/test-deployment.ts --network sepolia
```

## Common Patterns

### Safe Encrypted Division

Since FHEVM doesn't have native division, use bit shifting for powers of 2:

```solidity
// Divide by 2
euint8 half = FHE.shr(value, 1);

// Divide by 4
euint8 quarter = FHE.shr(value, 2);

// Divide by 8
euint8 eighth = FHE.shr(value, 3);
```

For non-power-of-2 division, use multiplication by reciprocal or approximation.

### Absolute Difference

```solidity
function _calculateAbsDiff(euint8 a, euint8 b) private returns (euint8) {
    ebool aGreater = FHE.gt(a, b);
    return FHE.select(
        aGreater,
        FHE.sub(a, b),
        FHE.sub(b, a)
    );
}
```

### Capping Values

```solidity
// Cap value at maximum
euint8 capped = FHE.select(
    FHE.gt(value, FHE.asEuint8(100)),  // If value > 100
    FHE.asEuint8(100),                  // Return 100
    value                               // Otherwise return value
);
```

### Batch Permission Granting

```solidity
function _grantPermissions(euint8 value, address user) private {
    FHE.allowThis(value);
    FHE.allow(value, user);
    FHE.allow(value, hospital);  // Allow hospital to monitor
}
```

## Troubleshooting

### Common Issues

**Issue**: "Missing FHE.allowThis permission"
```solidity
// ❌ Wrong
euint8 value = FHE.asEuint8(100);
// ... use value in computation ... ERROR!

// ✅ Correct
euint8 value = FHE.asEuint8(100);
FHE.allowThis(value);
// ... now can use in computation
```

**Issue**: "Decryption callback not triggered"
```solidity
// Ensure callback function is public/external
function processMatchResult(
    uint256 requestId,
    uint8 decryptedValue,
    bytes[] memory signatures
) external {  // Must be external, not private
    // ...
}
```

**Issue**: "Gas costs too high"
- Minimize encrypted operations
- Use batch operations where possible
- Optimize struct packing
- Consider caching computed values

### Debugging Tips

1. **Use Events**: Emit events for tracking state changes
```solidity
event DebugValue(string label, uint256 value);
emit DebugValue("Score calculated", uint256(score));
```

2. **Test Incrementally**: Test each new feature in isolation

3. **Check Permissions**: Verify FHE permissions are granted

4. **Validate Inputs**: Always validate before encryption

## Resources

### FHEVM Documentation
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Solidity API Reference](https://docs.zama.ai/fhevm/fundamentals/types)
- [Best Practices](https://docs.zama.ai/fhevm/guides/best-practices)

### Example Code
- [FHEVM Examples](https://github.com/zama-ai/fhevm-solidity)
- [OpenZeppelin Confidential](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)

### Community
- [Zama Discord](https://discord.com/invite/fhe-org)
- [Developer Forum](https://community.zama.ai)
- [GitHub Discussions](https://github.com/zama-ai/fhevm/discussions)

## Contributing

When contributing to this project:

1. **Follow Code Style**: Match existing patterns
2. **Add Tests**: Include tests for new features
3. **Update Docs**: Document new functionality
4. **Gas Optimization**: Consider gas costs
5. **Security First**: Think about edge cases

## Next Steps

- Explore the contract code in `contracts/PrivateOrganMatching.sol`
- Run the test suite with `npm test`
- Try adding a small feature
- Deploy to testnet
- Share your improvements!

---

**Happy developing!** If you build something cool with this codebase, let us know on the Zama Discord!
