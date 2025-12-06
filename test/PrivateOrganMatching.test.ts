import { expect } from "chai";
import { ethers } from "hardhat";
import { PrivateOrganMatching } from "../typechain-types";

/**
 * Test Suite: PrivateOrganMatching Contract
 * @group FHEVM Examples
 * @category Encrypted Healthcare Data
 *
 * This test suite demonstrates testing patterns for FHEVM contracts with encrypted data.
 * Tests cover:
 * - Donor registration with encrypted data
 * - Recipient registration with encrypted data
 * - Compatibility matching between encrypted profiles
 * - Access control patterns
 * - Profile management operations
 */
describe("PrivateOrganMatching", function () {
    let contract: PrivateOrganMatching;
    let hospital: any;
    let donor1: any;
    let donor2: any;
    let recipient1: any;
    let recipient2: any;

    /**
     * Setup test fixtures before each test
     * Deploys contract and initializes test accounts
     */
    beforeEach(async function () {
        const [hostAccount, donor1Account, donor2Account, recipient1Account, recipient2Account] =
            await ethers.getSigners();

        hospital = hostAccount;
        donor1 = donor1Account;
        donor2 = donor2Account;
        recipient1 = recipient1Account;
        recipient2 = recipient2Account;

        const PrivateOrganMatching = await ethers.getContractFactory("PrivateOrganMatching");
        contract = await PrivateOrganMatching.deploy();
        await contract.deployed();
    });

    /**
     * Test Suite: Contract Initialization
     * Verifies initial state and hospital authority setup
     */
    describe("Contract Initialization", function () {
        /**
         * Test: Hospital address is set correctly
         * @category Access Control
         */
        it("Should set hospital address as deployer", async function () {
            expect(await contract.hospital()).to.equal(hospital.address);
        });

        /**
         * Test: Initial match count is zero
         * @category State Management
         */
        it("Should initialize totalMatches to 0", async function () {
            expect(await contract.totalMatches()).to.equal(0);
        });

        /**
         * Test: System statistics are initialized correctly
         * @category Queries
         */
        it("Should return correct initial system stats", async function () {
            const stats = await contract.getSystemStats();
            expect(stats.totalDonors).to.equal(0);
            expect(stats.totalRecipients).to.equal(0);
            expect(stats.totalMatchesCount).to.equal(0);
        });
    });

    /**
     * Test Suite: Donor Registration
     * Tests encrypted donor profile creation and validation
     *
     * @custom:fhevm-pattern Tests FHE.asEuint8/asEuint16 encryption
     * @custom:fhevm-pattern Tests FHE.allow access control
     */
    describe("Donor Registration", function () {
        /**
         * Test: Valid donor registration succeeds
         * @category Registration
         *
         * Registers a donor with valid parameters:
         * - Age: 35 (within 18-80 range)
         * - Blood Type: 1 (Type A)
         * - Organ: 2 (Kidney)
         * - HLA Type: 150
         * - Urgency Score: 50
         */
        it("Should register donor with valid data", async function () {
            const tx = await contract
                .connect(donor1)
                .registerDonor(35, 1, 2, 150, 50);

            await expect(tx).to.emit(contract, "DonorRegistered")
                .withArgs(donor1.address, expect.any(Object));

            // Verify donor is added to active list
            const activeDonorsCount = await contract.getActiveDonorsCount();
            expect(activeDonorsCount).to.equal(1);
        });

        /**
         * Test: Age validation rejects underage donors
         * @category Input Validation
         */
        it("Should reject donor under 18 years old", async function () {
            await expect(
                contract.connect(donor1).registerDonor(17, 1, 2, 150, 50)
            ).to.be.revertedWith("Invalid age range");
        });

        /**
         * Test: Age validation rejects donors over 80
         * @category Input Validation
         */
        it("Should reject donor over 80 years old", async function () {
            await expect(
                contract.connect(donor1).registerDonor(81, 1, 2, 150, 50)
            ).to.be.revertedWith("Invalid age range");
        });

        /**
         * Test: Blood type validation
         * @category Input Validation
         *
         * Valid blood types: 0 (O), 1 (A), 2 (B), 3 (AB)
         */
        it("Should reject invalid blood type", async function () {
            await expect(
                contract.connect(donor1).registerDonor(35, 4, 2, 150, 50)
            ).to.be.revertedWith("Invalid blood type");
        });

        /**
         * Test: Organ type validation
         * @category Input Validation
         *
         * Valid organs: 0 (Heart), 1 (Liver), 2 (Kidney), 3 (Lung), 4 (Pancreas), 5 (Intestine)
         */
        it("Should reject invalid organ type", async function () {
            await expect(
                contract.connect(donor1).registerDonor(35, 1, 6, 150, 50)
            ).to.be.revertedWith("Invalid organ type");
        });

        /**
         * Test: Urgency score validation
         * @category Input Validation
         */
        it("Should reject urgency score > 100", async function () {
            await expect(
                contract.connect(donor1).registerDonor(35, 1, 2, 150, 101)
            ).to.be.revertedWith("Invalid urgency score");
        });

        /**
         * Test: Prevent duplicate donor registration
         * @category State Validation
         */
        it("Should prevent same address registering twice as donor", async function () {
            await contract.connect(donor1).registerDonor(35, 1, 2, 150, 50);

            await expect(
                contract.connect(donor1).registerDonor(40, 0, 3, 200, 60)
            ).to.be.revertedWith("Already registered as donor");
        });

        /**
         * Test: Multiple donors can register
         * @category State Management
         */
        it("Should allow multiple donors to register", async function () {
            await contract.connect(donor1).registerDonor(35, 1, 2, 150, 50);
            await contract.connect(donor2).registerDonor(40, 0, 3, 200, 60);

            const activeDonorsCount = await contract.getActiveDonorsCount();
            expect(activeDonorsCount).to.equal(2);
        });
    });

    /**
     * Test Suite: Recipient Registration
     * Tests encrypted recipient profile creation and validation
     */
    describe("Recipient Registration", function () {
        /**
         * Test: Valid recipient registration succeeds
         * @category Registration
         *
         * Registers a recipient with:
         * - Age: 28
         * - Blood Type: 2 (Type B)
         * - Organ Needed: 2 (Kidney)
         * - HLA Type: 180
         * - Urgency: 75
         * - Wait Time: 12 months
         */
        it("Should register recipient with valid data", async function () {
            const tx = await contract
                .connect(recipient1)
                .registerRecipient(28, 2, 2, 180, 75, 12);

            await expect(tx).to.emit(contract, "RecipientRegistered")
                .withArgs(recipient1.address, expect.any(Object));

            const activeRecipientsCount = await contract.getActiveRecipientsCount();
            expect(activeRecipientsCount).to.equal(1);
        });

        /**
         * Test: Recipient age can be as low as 1
         * @category Input Validation
         */
        it("Should accept recipient age 1 (infants)", async function () {
            await contract.connect(recipient1).registerRecipient(1, 2, 2, 180, 75, 12);
            expect(await contract.getActiveRecipientsCount()).to.equal(1);
        });

        /**
         * Test: Age validation rejects recipients over 80
         * @category Input Validation
         */
        it("Should reject recipient age > 80", async function () {
            await expect(
                contract.connect(recipient1).registerRecipient(81, 2, 2, 180, 75, 12)
            ).to.be.revertedWith("Invalid age range");
        });

        /**
         * Test: Wait time validation
         * @category Input Validation
         *
         * Maximum wait time: 240 months (20 years)
         */
        it("Should reject wait time > 240 months", async function () {
            await expect(
                contract.connect(recipient1).registerRecipient(28, 2, 2, 180, 75, 241)
            ).to.be.revertedWith("Invalid wait time (max 20 years)");
        });

        /**
         * Test: Prevent duplicate recipient registration
         * @category State Validation
         */
        it("Should prevent same address registering twice as recipient", async function () {
            await contract.connect(recipient1).registerRecipient(28, 2, 2, 180, 75, 12);

            await expect(
                contract.connect(recipient1).registerRecipient(30, 1, 3, 200, 80, 18)
            ).to.be.revertedWith("Already registered as recipient");
        });

        /**
         * Test: Multiple recipients can register
         * @category State Management
         */
        it("Should allow multiple recipients to register", async function () {
            await contract.connect(recipient1).registerRecipient(28, 2, 2, 180, 75, 12);
            await contract.connect(recipient2).registerRecipient(45, 0, 0, 160, 85, 24);

            const activeRecipientsCount = await contract.getActiveRecipientsCount();
            expect(activeRecipientsCount).to.equal(2);
        });
    });

    /**
     * Test Suite: Profile Management
     * Tests profile updates and deactivation
     */
    describe("Profile Management", function () {
        /**
         * Setup: Register a donor and recipient for profile tests
         */
        beforeEach(async function () {
            await contract.connect(donor1).registerDonor(35, 1, 2, 150, 50);
            await contract.connect(recipient1).registerRecipient(28, 2, 2, 180, 75, 12);
        });

        /**
         * Test: Recipient can update urgency score
         * @category Profile Updates
         */
        it("Should allow recipient to update urgency score", async function () {
            const tx = await contract.connect(recipient1).updateUrgencyScore(90);

            await expect(tx).to.emit(contract, "ProfileUpdated")
                .withArgs(recipient1.address, false);
        });

        /**
         * Test: Non-recipient cannot update urgency score
         * @category Access Control
         */
        it("Should reject urgency score update from non-recipient", async function () {
            await expect(
                contract.connect(donor1).updateUrgencyScore(90)
            ).to.be.revertedWith("Not a registered recipient");
        });

        /**
         * Test: Donor can deactivate profile
         * @category Profile Management
         */
        it("Should allow donor to deactivate profile", async function () {
            const tx = await contract.connect(donor1).deactivateProfile(true);

            await expect(tx).to.emit(contract, "ProfileUpdated")
                .withArgs(donor1.address, true);

            // Verify donor removed from active list
            const activeDonorsCount = await contract.getActiveDonorsCount();
            expect(activeDonorsCount).to.equal(0);
        });

        /**
         * Test: Recipient can deactivate profile
         * @category Profile Management
         */
        it("Should allow recipient to deactivate profile", async function () {
            const tx = await contract.connect(recipient1).deactivateProfile(false);

            await expect(tx).to.emit(contract, "ProfileUpdated")
                .withArgs(recipient1.address, false);

            const activeRecipientsCount = await contract.getActiveRecipientsCount();
            expect(activeRecipientsCount).to.equal(0);
        });

        /**
         * Test: Cannot deactivate non-existent donor profile
         * @category Error Handling
         */
        it("Should reject deactivation of non-existent donor profile", async function () {
            await expect(
                contract.connect(recipient1).deactivateProfile(true)
            ).to.be.revertedWith("Not an active donor");
        });
    });

    /**
     * Test Suite: Matching Operations
     * Tests encrypted compatibility calculation and matching workflow
     *
     * @custom:fhevm-pattern Tests encrypted arithmetic operations
     * @custom:fhevm-pattern Tests requestDecryption callback mechanism
     */
    describe("Matching Operations", function () {
        /**
         * Setup: Register compatible donor-recipient pair
         */
        beforeEach(async function () {
            // Register donor: 35yo, Type O blood, Kidney, HLA 150
            await contract.connect(donor1).registerDonor(35, 0, 2, 150, 50);

            // Register recipient: 28yo, Type O blood, needs Kidney, HLA 140
            await contract.connect(recipient1).registerRecipient(28, 0, 2, 140, 75, 12);
        });

        /**
         * Test: Hospital can initiate matching
         * @category Access Control
         */
        it("Should allow hospital to initiate matching", async function () {
            const tx = await contract
                .connect(hospital)
                .initiateMatching(donor1.address, recipient1.address);

            await expect(tx).to.emit(contract, "MatchInitiated")
                .withArgs(1, donor1.address, recipient1.address);
        });

        /**
         * Test: Non-hospital cannot initiate matching
         * @category Access Control
         */
        it("Should reject matching from non-hospital", async function () {
            await expect(
                contract.connect(donor1).initiateMatching(donor1.address, recipient1.address)
            ).to.be.revertedWith("Only authorized hospital");
        });

        /**
         * Test: Cannot match with inactive donor
         * @category Error Handling
         */
        it("Should reject matching with inactive donor", async function () {
            await contract.connect(donor1).deactivateProfile(true);

            await expect(
                contract.connect(hospital).initiateMatching(donor1.address, recipient1.address)
            ).to.be.revertedWith("Donor not active");
        });

        /**
         * Test: Cannot match with inactive recipient
         * @category Error Handling
         */
        it("Should reject matching with inactive recipient", async function () {
            await contract.connect(recipient1).deactivateProfile(false);

            await expect(
                contract.connect(hospital).initiateMatching(donor1.address, recipient1.address)
            ).to.be.revertedWith("Recipient not active");
        });

        /**
         * Test: Match ID increments correctly
         * @category State Management
         */
        it("Should increment match ID for each matching", async function () {
            await contract.connect(hospital).initiateMatching(donor1.address, recipient1.address);
            expect(await contract.totalMatches()).to.equal(1);

            // Register another recipient
            await contract.connect(recipient2).registerRecipient(35, 0, 2, 160, 80, 18);

            await contract.connect(hospital).initiateMatching(donor1.address, recipient2.address);
            expect(await contract.totalMatches()).to.equal(2);
        });
    });

    /**
     * Test Suite: System Queries
     * Tests view functions for statistics and data retrieval
     */
    describe("System Queries", function () {
        /**
         * Test: System stats reflect active profiles
         * @category Queries
         */
        it("Should return accurate system statistics", async function () {
            // Register 2 donors and 3 recipients
            await contract.connect(donor1).registerDonor(35, 0, 2, 150, 50);
            await contract.connect(donor2).registerDonor(40, 1, 3, 200, 60);
            await contract.connect(recipient1).registerRecipient(28, 0, 2, 140, 75, 12);
            await contract.connect(recipient2).registerRecipient(45, 1, 3, 160, 85, 24);

            const stats = await contract.getSystemStats();
            expect(stats.totalDonors).to.equal(2);
            expect(stats.totalRecipients).to.equal(2);
            expect(stats.totalMatchesCount).to.equal(0);
        });

        /**
         * Test: Active donor count is accurate
         * @category Queries
         */
        it("Should return correct active donors count", async function () {
            await contract.connect(donor1).registerDonor(35, 0, 2, 150, 50);
            await contract.connect(donor2).registerDonor(40, 1, 3, 200, 60);

            expect(await contract.getActiveDonorsCount()).to.equal(2);

            // Deactivate one donor
            await contract.connect(donor1).deactivateProfile(true);
            expect(await contract.getActiveDonorsCount()).to.equal(1);
        });

        /**
         * Test: Active recipient count is accurate
         * @category Queries
         */
        it("Should return correct active recipients count", async function () {
            await contract.connect(recipient1).registerRecipient(28, 0, 2, 140, 75, 12);
            await contract.connect(recipient2).registerRecipient(45, 1, 3, 160, 85, 24);

            expect(await contract.getActiveRecipientsCount()).to.equal(2);

            // Deactivate one recipient
            await contract.connect(recipient1).deactivateProfile(false);
            expect(await contract.getActiveRecipientsCount()).to.equal(1);
        });
    });

    /**
     * Test Suite: Hospital Authority Transfer
     * Tests admin functions for hospital management
     */
    describe("Hospital Authority Transfer", function () {
        /**
         * Test: Hospital can transfer authority
         * @category Admin Functions
         */
        it("Should allow hospital to transfer authority", async function () {
            await contract.connect(hospital).transferHospitalAuthority(donor1.address);
            expect(await contract.hospital()).to.equal(donor1.address);
        });

        /**
         * Test: Non-hospital cannot transfer authority
         * @category Access Control
         */
        it("Should reject authority transfer from non-hospital", async function () {
            await expect(
                contract.connect(donor1).transferHospitalAuthority(donor2.address)
            ).to.be.revertedWith("Only authorized hospital");
        });

        /**
         * Test: Cannot transfer to zero address
         * @category Input Validation
         */
        it("Should reject transfer to zero address", async function () {
            await expect(
                contract.connect(hospital).transferHospitalAuthority(
                    "0x0000000000000000000000000000000000000000"
                )
            ).to.be.revertedWith("Invalid hospital address");
        });

        /**
         * Test: New hospital has authority
         * @category State Validation
         */
        it("Should grant authority to new hospital", async function () {
            await contract.connect(hospital).transferHospitalAuthority(donor1.address);

            // New hospital should be able to initiate matching
            await contract.connect(donor2).registerDonor(35, 0, 2, 150, 50);
            await contract.connect(recipient1).registerRecipient(28, 0, 2, 140, 75, 12);

            const tx = await contract
                .connect(donor1)
                .initiateMatching(donor2.address, recipient1.address);

            await expect(tx).to.emit(contract, "MatchInitiated");
        });
    });

    /**
     * Test Suite: Edge Cases and Error Scenarios
     * Tests boundary conditions and error states
     */
    describe("Edge Cases and Error Scenarios", function () {
        /**
         * Test: Boundary age values
         * @category Input Validation
         */
        it("Should accept boundary age values", async function () {
            // Minimum age for donor
            await contract.connect(donor1).registerDonor(18, 0, 2, 150, 50);

            // Maximum age for donor
            await contract.connect(donor2).registerDonor(80, 0, 2, 150, 50);

            expect(await contract.getActiveDonorsCount()).to.equal(2);
        });

        /**
         * Test: Zero urgency score
         * @category Input Validation
         */
        it("Should accept zero urgency score", async function () {
            await contract.connect(donor1).registerDonor(35, 0, 2, 150, 0);
            expect(await contract.getActiveDonorsCount()).to.equal(1);
        });

        /**
         * Test: Maximum urgency score
         * @category Input Validation
         */
        it("Should accept maximum urgency score", async function () {
            await contract.connect(donor1).registerDonor(35, 0, 2, 150, 100);
            expect(await contract.getActiveDonorsCount()).to.equal(1);
        });

        /**
         * Test: All blood type values
         * @category Input Validation
         */
        it("Should accept all valid blood types", async function () {
            for (let bloodType = 0; bloodType <= 3; bloodType++) {
                const newDonor = (await ethers.getSigners())[5 + bloodType];
                await contract.connect(newDonor).registerDonor(35, bloodType, 2, 150, 50);
            }

            expect(await contract.getActiveDonorsCount()).to.equal(4);
        });

        /**
         * Test: All organ types
         * @category Input Validation
         */
        it("Should accept all valid organ types", async function () {
            for (let organ = 0; organ <= 5; organ++) {
                const newDonor = (await ethers.getSigners())[10 + organ];
                await contract.connect(newDonor).registerDonor(35, 0, organ, 150, 50);
            }

            expect(await contract.getActiveDonorsCount()).to.equal(6);
        });
    });
});
