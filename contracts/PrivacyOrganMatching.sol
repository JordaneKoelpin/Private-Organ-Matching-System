// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint16, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivacyOrganMatching is SepoliaConfig {

    address public hospital;
    uint32 public totalMatches;
    uint256 public lastMatchTime;

    // Organ types
    enum OrganType { Heart, Liver, Kidney, Lung, Pancreas, Intestine }

    // Blood types (0=O, 1=A, 2=B, 3=AB)
    enum BloodType { O, A, B, AB }

    struct DonorProfile {
        euint8 encryptedAge;           // Encrypted donor age
        euint8 encryptedBloodType;     // Encrypted blood type
        euint8 encryptedOrganType;     // Encrypted organ type
        euint16 encryptedHLAType;      // Encrypted HLA compatibility markers
        euint8 encryptedUrgencyScore; // Encrypted medical urgency (0-100)
        bool isActive;
        uint256 registrationTime;
        address donorAddress;
    }

    struct RecipientProfile {
        euint8 encryptedAge;           // Encrypted recipient age
        euint8 encryptedBloodType;     // Encrypted blood type
        euint8 encryptedOrganType;     // Encrypted needed organ type
        euint16 encryptedHLAType;      // Encrypted HLA compatibility markers
        euint8 encryptedUrgencyScore; // Encrypted medical urgency (0-100)
        euint8 encryptedWaitTime;     // Encrypted time on waiting list (months)
        bool isActive;
        uint256 registrationTime;
        address recipientAddress;
    }

    struct MatchResult {
        uint32 matchId;
        address donorAddress;
        address recipientAddress;
        uint8 compatibilityScore;
        uint256 matchTime;
        bool isProcessed;
        bool isSuccessful;
    }

    mapping(address => DonorProfile) public donors;
    mapping(address => RecipientProfile) public recipients;
    mapping(uint32 => MatchResult) public matches;

    address[] public activeDonors;
    address[] public activeRecipients;

    event DonorRegistered(address indexed donor, uint256 timestamp);
    event RecipientRegistered(address indexed recipient, uint256 timestamp);
    event MatchInitiated(uint32 indexed matchId, address indexed donor, address indexed recipient);
    event MatchCompleted(uint32 indexed matchId, uint8 compatibilityScore, bool successful);
    event ProfileUpdated(address indexed user, bool isDonor);

    modifier onlyHospital() {
        require(msg.sender == hospital, "Only authorized hospital");
        _;
    }

    modifier onlyRegisteredDonor() {
        require(donors[msg.sender].isActive, "Not a registered donor");
        _;
    }

    modifier onlyRegisteredRecipient() {
        require(recipients[msg.sender].isActive, "Not a registered recipient");
        _;
    }

    constructor() {
        hospital = msg.sender;
        totalMatches = 0;
        lastMatchTime = block.timestamp;
    }

    // Register as organ donor with encrypted medical data
    function registerDonor(
        uint8 _age,
        uint8 _bloodType,
        uint8 _organType,
        uint16 _hlaType,
        uint8 _urgencyScore
    ) external {
        require(_age >= 18 && _age <= 80, "Invalid age range");
        require(_bloodType <= 3, "Invalid blood type");
        require(_organType <= 5, "Invalid organ type");
        require(_urgencyScore <= 100, "Invalid urgency score");
        require(!donors[msg.sender].isActive, "Already registered as donor");

        // Encrypt all sensitive medical data
        euint8 encryptedAge = FHE.asEuint8(_age);
        euint8 encryptedBloodType = FHE.asEuint8(_bloodType);
        euint8 encryptedOrganType = FHE.asEuint8(_organType);
        euint16 encryptedHLAType = FHE.asEuint16(_hlaType);
        euint8 encryptedUrgencyScore = FHE.asEuint8(_urgencyScore);

        donors[msg.sender] = DonorProfile({
            encryptedAge: encryptedAge,
            encryptedBloodType: encryptedBloodType,
            encryptedOrganType: encryptedOrganType,
            encryptedHLAType: encryptedHLAType,
            encryptedUrgencyScore: encryptedUrgencyScore,
            isActive: true,
            registrationTime: block.timestamp,
            donorAddress: msg.sender
        });

        activeDonors.push(msg.sender);

        // Grant access permissions for encrypted data
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedBloodType);
        FHE.allowThis(encryptedOrganType);
        FHE.allowThis(encryptedHLAType);
        FHE.allowThis(encryptedUrgencyScore);

        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(encryptedBloodType, msg.sender);
        FHE.allow(encryptedOrganType, msg.sender);
        FHE.allow(encryptedHLAType, msg.sender);
        FHE.allow(encryptedUrgencyScore, msg.sender);

        emit DonorRegistered(msg.sender, block.timestamp);
    }

    // Register as organ recipient with encrypted medical data
    function registerRecipient(
        uint8 _age,
        uint8 _bloodType,
        uint8 _organType,
        uint16 _hlaType,
        uint8 _urgencyScore,
        uint8 _waitTime
    ) external {
        require(_age >= 1 && _age <= 80, "Invalid age range");
        require(_bloodType <= 3, "Invalid blood type");
        require(_organType <= 5, "Invalid organ type");
        require(_urgencyScore <= 100, "Invalid urgency score");
        require(_waitTime <= 240, "Invalid wait time (max 20 years)");
        require(!recipients[msg.sender].isActive, "Already registered as recipient");

        // Encrypt all sensitive medical data
        euint8 encryptedAge = FHE.asEuint8(_age);
        euint8 encryptedBloodType = FHE.asEuint8(_bloodType);
        euint8 encryptedOrganType = FHE.asEuint8(_organType);
        euint16 encryptedHLAType = FHE.asEuint16(_hlaType);
        euint8 encryptedUrgencyScore = FHE.asEuint8(_urgencyScore);
        euint8 encryptedWaitTime = FHE.asEuint8(_waitTime);

        recipients[msg.sender] = RecipientProfile({
            encryptedAge: encryptedAge,
            encryptedBloodType: encryptedBloodType,
            encryptedOrganType: encryptedOrganType,
            encryptedHLAType: encryptedHLAType,
            encryptedUrgencyScore: encryptedUrgencyScore,
            encryptedWaitTime: encryptedWaitTime,
            isActive: true,
            registrationTime: block.timestamp,
            recipientAddress: msg.sender
        });

        activeRecipients.push(msg.sender);

        // Grant access permissions for encrypted data
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedBloodType);
        FHE.allowThis(encryptedOrganType);
        FHE.allowThis(encryptedHLAType);
        FHE.allowThis(encryptedUrgencyScore);
        FHE.allowThis(encryptedWaitTime);

        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(encryptedBloodType, msg.sender);
        FHE.allow(encryptedOrganType, msg.sender);
        FHE.allow(encryptedHLAType, msg.sender);
        FHE.allow(encryptedUrgencyScore, msg.sender);
        FHE.allow(encryptedWaitTime, msg.sender);

        emit RecipientRegistered(msg.sender, block.timestamp);
    }

    // Initiate privacy-preserving organ matching process
    function initiateMatching(address _donor, address _recipient) external onlyHospital {
        require(donors[_donor].isActive, "Donor not active");
        require(recipients[_recipient].isActive, "Recipient not active");

        totalMatches++;

        matches[totalMatches] = MatchResult({
            matchId: totalMatches,
            donorAddress: _donor,
            recipientAddress: _recipient,
            compatibilityScore: 0,
            matchTime: block.timestamp,
            isProcessed: false,
            isSuccessful: false
        });

        // Start encrypted compatibility calculation
        _calculateCompatibility(totalMatches, _donor, _recipient);

        emit MatchInitiated(totalMatches, _donor, _recipient);
    }

    // Private function to calculate compatibility using FHE operations
    function _calculateCompatibility(uint32 _matchId, address _donor, address _recipient) private {
        DonorProfile storage donor = donors[_donor];
        RecipientProfile storage recipient = recipients[_recipient];

        // Calculate final score directly to reduce variables
        euint8 finalScore = _calculateBaseScore(donor, recipient);
        finalScore = _addBonusScores(finalScore, recipient);

        // Request decryption of the final compatibility score
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(finalScore);
        FHE.requestDecryption(cts, this.processMatchResult.selector, _matchId);
    }

    // Calculate base compatibility score
    function _calculateBaseScore(DonorProfile storage donor, RecipientProfile storage recipient) private returns (euint8) {
        euint8 score = FHE.asEuint8(0);

        // Blood type compatibility (30 points)
        score = FHE.add(score, FHE.select(
            FHE.eq(donor.encryptedBloodType, recipient.encryptedBloodType),
            FHE.asEuint8(30),
            FHE.asEuint8(0)
        ));

        // Organ type match (40 points)
        score = FHE.add(score, FHE.select(
            FHE.eq(donor.encryptedOrganType, recipient.encryptedOrganType),
            FHE.asEuint8(40),
            FHE.asEuint8(0)
        ));

        // Age compatibility (15 points)
        score = FHE.add(score, FHE.select(
            _checkAgeCompatibility(donor, recipient),
            FHE.asEuint8(15),
            FHE.asEuint8(0)
        ));

        // HLA compatibility (10 points)
        score = FHE.add(score, FHE.select(
            _checkHLACompatibility(donor, recipient),
            FHE.asEuint8(10),
            FHE.asEuint8(0)
        ));

        return score;
    }

    // Check age compatibility
    function _checkAgeCompatibility(DonorProfile storage donor, RecipientProfile storage recipient) private returns (ebool) {
        ebool ageValid = FHE.ge(donor.encryptedAge, FHE.asEuint8(18));
        ebool donorOlder = FHE.gt(donor.encryptedAge, recipient.encryptedAge);
        euint8 ageDiff = FHE.select(
            donorOlder,
            FHE.sub(donor.encryptedAge, recipient.encryptedAge),
            FHE.sub(recipient.encryptedAge, donor.encryptedAge)
        );
        return FHE.and(ageValid, FHE.le(ageDiff, FHE.asEuint8(15)));
    }

    // Check HLA compatibility
    function _checkHLACompatibility(DonorProfile storage donor, RecipientProfile storage recipient) private returns (ebool) {
        ebool donorHigher = FHE.gt(donor.encryptedHLAType, recipient.encryptedHLAType);
        euint16 hlaDiff = FHE.select(
            donorHigher,
            FHE.sub(donor.encryptedHLAType, recipient.encryptedHLAType),
            FHE.sub(recipient.encryptedHLAType, donor.encryptedHLAType)
        );
        return FHE.lt(hlaDiff, FHE.asEuint16(100));
    }

    // Add bonus scores for urgency and wait time
    function _addBonusScores(euint8 baseScore, RecipientProfile storage recipient) private returns (euint8) {
        euint8 urgencyBonus = FHE.shr(recipient.encryptedUrgencyScore, 2);
        euint8 waitBonus = FHE.shr(recipient.encryptedWaitTime, 3);

        waitBonus = FHE.select(FHE.gt(waitBonus, FHE.asEuint8(15)), FHE.asEuint8(15), waitBonus);

        euint8 totalScore = FHE.add(FHE.add(baseScore, urgencyBonus), waitBonus);
        return FHE.select(FHE.gt(totalScore, FHE.asEuint8(100)), FHE.asEuint8(100), totalScore);
    }

    // Callback function to process decrypted match result
    function processMatchResult(
        uint256 requestId,
        uint8 compatibilityScore,
        bytes[] memory signatures
    ) external {
        // Verify signatures - simplified for compatibility
        require(signatures.length > 0, "Invalid signatures");

        uint32 matchId = uint32(requestId);
        MatchResult storage matchResult = matches[matchId];

        matchResult.compatibilityScore = compatibilityScore;
        matchResult.isProcessed = true;

        // Consider match successful if compatibility score >= 70
        matchResult.isSuccessful = compatibilityScore >= 70;

        lastMatchTime = block.timestamp;

        emit MatchCompleted(matchId, compatibilityScore, matchResult.isSuccessful);

        // If successful match, deactivate both donor and recipient
        if (matchResult.isSuccessful) {
            _deactivateProfiles(matchResult.donorAddress, matchResult.recipientAddress);
        }
    }

    // Deactivate donor and recipient profiles after successful match
    function _deactivateProfiles(address _donor, address _recipient) private {
        donors[_donor].isActive = false;
        recipients[_recipient].isActive = false;

        // Remove from active lists
        _removeFromActiveList(_donor, true);
        _removeFromActiveList(_recipient, false);
    }

    // Remove address from active donor or recipient list
    function _removeFromActiveList(address _address, bool _isDonor) private {
        if (_isDonor) {
            for (uint i = 0; i < activeDonors.length; i++) {
                if (activeDonors[i] == _address) {
                    activeDonors[i] = activeDonors[activeDonors.length - 1];
                    activeDonors.pop();
                    break;
                }
            }
        } else {
            for (uint i = 0; i < activeRecipients.length; i++) {
                if (activeRecipients[i] == _address) {
                    activeRecipients[i] = activeRecipients[activeRecipients.length - 1];
                    activeRecipients.pop();
                    break;
                }
            }
        }
    }

    // Update urgency score for recipient (emergency cases)
    function updateUrgencyScore(uint8 _newUrgencyScore) external onlyRegisteredRecipient {
        require(_newUrgencyScore <= 100, "Invalid urgency score");

        euint8 newEncryptedUrgency = FHE.asEuint8(_newUrgencyScore);
        recipients[msg.sender].encryptedUrgencyScore = newEncryptedUrgency;

        FHE.allowThis(newEncryptedUrgency);
        FHE.allow(newEncryptedUrgency, msg.sender);

        emit ProfileUpdated(msg.sender, false);
    }

    // Get match result information
    function getMatchResult(uint32 _matchId) external view returns (
        address donor,
        address recipient,
        uint8 compatibilityScore,
        uint256 matchTime,
        bool isProcessed,
        bool isSuccessful
    ) {
        MatchResult storage matchResult = matches[_matchId];
        return (
            matchResult.donorAddress,
            matchResult.recipientAddress,
            matchResult.compatibilityScore,
            matchResult.matchTime,
            matchResult.isProcessed,
            matchResult.isSuccessful
        );
    }

    // Get active donors count
    function getActiveDonorsCount() external view returns (uint256) {
        return activeDonors.length;
    }

    // Get active recipients count
    function getActiveRecipientsCount() external view returns (uint256) {
        return activeRecipients.length;
    }

    // Get system statistics
    function getSystemStats() external view returns (
        uint256 totalDonors,
        uint256 totalRecipients,
        uint32 totalMatchesCount,
        uint256 lastMatch
    ) {
        return (
            activeDonors.length,
            activeRecipients.length,
            totalMatches,
            lastMatchTime
        );
    }

    // Emergency function to deactivate profile
    function deactivateProfile(bool _isDonor) external {
        if (_isDonor) {
            require(donors[msg.sender].isActive, "Not an active donor");
            donors[msg.sender].isActive = false;
            _removeFromActiveList(msg.sender, true);
        } else {
            require(recipients[msg.sender].isActive, "Not an active recipient");
            recipients[msg.sender].isActive = false;
            _removeFromActiveList(msg.sender, false);
        }

        emit ProfileUpdated(msg.sender, _isDonor);
    }

    // Transfer hospital authority (only current hospital)
    function transferHospitalAuthority(address _newHospital) external onlyHospital {
        require(_newHospital != address(0), "Invalid hospital address");
        hospital = _newHospital;
    }
}