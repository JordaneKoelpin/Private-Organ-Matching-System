import { ethers } from "hardhat";

/**
 * Deployment Script: PrivateOrganMatching
 *
 * This script deploys the PrivateOrganMatching contract to the configured network.
 * It saves deployment information for verification and future interactions.
 */
async function main() {
    console.log("\n🚀 Starting deployment of PrivateOrganMatching contract...\n");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();

    console.log("📋 Deployment Details:");
    console.log("━".repeat(60));
    console.log(`Deploying from: ${deployer.address}`);
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name} (Chain ID: ${(await ethers.provider.getNetwork()).chainId})`);
    console.log("━".repeat(60));
    console.log();

    // Deploy contract
    console.log("📦 Deploying contract...");
    const PrivateOrganMatching = await ethers.getContractFactory("PrivateOrganMatching");
    const contract = await PrivateOrganMatching.deploy();

    console.log("⏳ Waiting for deployment transaction...");
    await contract.deployed();

    console.log("\n✅ Contract deployed successfully!");
    console.log("━".repeat(60));
    console.log(`Contract address: ${contract.address}`);
    console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
    console.log(`Block number: ${contract.deployTransaction.blockNumber}`);
    console.log(`Gas used: ${(await contract.deployTransaction.wait()).gasUsed.toString()}`);
    console.log("━".repeat(60));

    // Wait for a few blocks before verification
    console.log("\n⏳ Waiting for blocks to be mined for verification...");
    await contract.deployTransaction.wait(5);

    // Display verification command
    console.log("\n📝 To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${(await ethers.provider.getNetwork()).name} ${contract.address}`);

    // Display contract info
    console.log("\n📊 Contract Information:");
    console.log("━".repeat(60));
    console.log(`Hospital Coordinator: ${await contract.hospital()}`);
    console.log(`Total Matches: ${await contract.totalMatches()}`);
    console.log(`Active Donors: ${await contract.getActiveDonorsCount()}`);
    console.log(`Active Recipients: ${await contract.getActiveRecipientsCount()}`);
    console.log("━".repeat(60));

    // Save deployment info to file
    const fs = require("fs");
    const deploymentInfo = {
        network: (await ethers.provider.getNetwork()).name,
        chainId: (await ethers.provider.getNetwork()).chainId,
        contractAddress: contract.address,
        deployerAddress: deployer.address,
        transactionHash: contract.deployTransaction.hash,
        blockNumber: contract.deployTransaction.blockNumber,
        timestamp: new Date().toISOString(),
    };

    const deploymentPath = `./deployments/${deploymentInfo.network}-${deploymentInfo.chainId}.json`;

    if (!fs.existsSync("./deployments")) {
        fs.mkdirSync("./deployments");
    }

    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);

    console.log("\n✨ Deployment complete!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
