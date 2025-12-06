# Video Demonstration Script

## One-Minute Video Dialogue

Welcome to the Private Organ Matching System, a production-ready FHEVM example for the Zama Bounty Track December 2025. This project demonstrates how blockchain can revolutionize healthcare privacy through fully homomorphic encryption.

Let me show you what makes this special. Traditional organ donation systems expose sensitive medical data to coordinators. With FHEVM, we can match donors and recipients while keeping all medical information encrypted on-chain.

Here's our smart contract. Notice how we use encrypted data types: euint8 for age and blood type, euint16 for HLA tissue markers. All sensitive information stays encrypted - no plaintext ever touches the blockchain.

Let's look at the compatibility algorithm. Using FHE.eq, we compare encrypted blood types without decryption. With FHE.select, we implement encrypted conditional logic - think of it as an encrypted if-else statement. The algorithm scores compatibility based on blood type, organ type, age, HLA markers, urgency, and wait time - all computed on encrypted values.

Now I'll run our comprehensive test suite. Watch as we test forty-plus scenarios covering registration, matching, access control, and edge cases. Every test passes, demonstrating production-ready quality.

Let me compile and deploy the contract. The deployment script provides detailed logging and verification. In just seconds, we have a fully functional privacy-preserving organ matching system on the blockchain.

Here's the key innovation: individual medical records remain encrypted forever. Only the final compatibility score is decrypted through FHE.requestDecryption. This minimal decryption approach ensures maximum privacy while maintaining system transparency.

This project showcases eight different FHEVM patterns: encrypted data types, access control with FHE.allow and FHE.allowThis, encrypted comparisons with FHE.eq and FHE.le, arithmetic operations with FHE.add and FHE.sub, conditional selection with FHE.select, logical operations with FHE.and, bit shifting with FHE.shr for efficient division, and public decryption callbacks.

The real-world impact is significant. Patients can participate in organ donation programs without fear of privacy breaches or discrimination. Hospitals can perform matching without accessing raw medical data. The blockchain provides transparency and auditability while encryption guarantees privacy.

Every aspect meets the bounty requirements: standalone Hardhat project, comprehensive testing, full documentation with NatSpec and TSDoc comments, deployment automation, and real-world healthcare use case. This is privacy-preserving blockchain technology at its finest.

Thank you for watching. The complete source code, documentation, and setup instructions are available in the repository. Let's build a more private future for healthcare together.
