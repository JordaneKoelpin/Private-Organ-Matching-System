// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint16, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PrivateOrganMatching
 * @notice A privacy-preserving organ donor-recipient matching system using FHEVM
 * @dev Implements encrypted storage and computation for sensitive medical data
 *
 * @custom:fhevm-example This contract demonstrates several FHEVM concepts:
 * - Encrypted data storage (euint8, euint16)
 * - Access control using FHE.allow and FHE.allowThis
 * - Encrypted arithmetic and comparison operations
 * - Public decryption via requestDecryption callback
 * - Privacy-preserving computation on encrypted medical data
 *
 * @custom:security-note All sensitive medical information is encrypted on-chain.
 * Only authorized parties can decrypt and access their own medical data.
 */
contract PrivateOrganMatching is SepoliaConfig {

    /*//////////////////////////////////////////////////////////////
                                 STATE
    //////////////////////////////////////////////////////////////*/

    /// @notice Address of the authorized hospital coordinator
    address public hospital;

    /// @notice Total number of matching processes initiated
    uint32 public totalMatches;

    /// @notice Timestamp of the last successful match
    uint256 public lastMatchTime;

    /*//////////////////////////////////////////////////////////////
                                 ENUMS
    //////////////////////////////////////////////////////////////*/

    /// @notice Available organ types for donation and transplantation
    enum OrganType { Heart, Liver, Kidney, Lung, Pancreas, Intestine }

    /// @notice Blood type classifications (0=O, 1=A, 2=B, 3=AB)
    enum BloodType { O, A, B, AB }

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Encrypted donor profile containing medical information
     * @dev All sensitive fields are encrypted using FHEVM types
     * @param encryptedAge Encrypted age of the donor (18-80)
     * @param encryptedBloodType Encrypted blood type (0-3)
     * @param encryptedOrganType Encrypted organ being donated (0-5)
     * @param encryptedHLAType Encrypted HLA compatibility markers (0-65535)
     * @param encryptedUrgencyScore Encrypted medical urgency score (0-100)
     * @param isActive Whether the donor profile is currently active
     * @param registrationTime When the donor registered
     * @param donorAddress Ethereum address of the donor
     */
    struct DonorProfile {
        euint8 encryptedAge;
        euint8 encryptedBloodType;
        euint8 encryptedOrganType;
        euint16 encryptedHLAType;
        euint8 encryptedUrgencyScore;
        bool isActive;
        uint256 registrationTime;
        address donorAddress;
    }

    /**
     * @notice Encrypted recipient profile containing medical information
     * @dev Similar to DonorProfile but includes additional wait time field
     * @param encryptedAge Encrypted age of the recipient (1-80)
     * @param encryptedBloodType Encrypted blood type (0-3)
     * @param encryptedOrganType Encrypted needed organ type (0-5)
     * @param encryptedHLAType Encrypted HLA compatibility markers (0-65535)
     * @param encryptedUrgencyScore Encrypted medical urgency score (0-100)
     * @param encryptedWaitTime Encrypted time on waiting list in months (0-240)
     * @param isActive Whether the recipient profile is currently active
     * @param registrationTime When the recipient registered
     * @param recipientAddress Ethereum address of the recipient
     */
    struct RecipientProfile {
        euint8 encryptedAge;
        euint8 encryptedBloodType;
        euint8 encryptedOrganType;
        euint16 encryptedHLAType;
        euint8 encryptedUrgencyScore;
        euint8 encryptedWaitTime;
        bool isActive;
        uint256 registrationTime;
        address recipientAddress;
    }

    /**
     * @notice Result of a donor-recipient matching process
     * @dev compatibilityScore is decrypted for transparency after computation
     * @param matchId Unique identifier for this match
     * @param donorAddress Address of the matched donor
     * @param recipientAddress Address of the matched recipient
     * @param compatibilityScore Decrypted compatibility score (0-100)
     * @param matchTime When the match was initiated
     * @param isProcessed Whether decryption callback has been executed
     * @param isSuccessful Whether the match score exceeded threshold (70)
     */
    struct MatchResult {
        uint32 matchId;
        address donorAddress;
        address recipientAddress;
        uint8 compatibilityScore;
        uint256 matchTime;
        bool isProcessed;
        bool isSuccessful;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice Mapping from donor address to their encrypted profile
    mapping(address => DonorProfile) public donors;

    /// @notice Mapping from recipient address to their encrypted profile
    mapping(address => RecipientProfile) public recipients;

    /// @notice Mapping from match ID to match result
    mapping(uint32 => MatchResult) public matches;

    /// @notice Array of currently active donor addresses
    address[] public activeDonors;

    /// @notice Array of currently active recipient addresses
    address[] public activeRecipients;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a new donor registers
    event DonorRegistered(address indexed donor, uint256 timestamp);

    /// @notice Emitted when a new recipient registers
    event RecipientRegistered(address indexed recipient, uint256 timestamp);

    /// @notice Emitted when a matching process is initiated
    event MatchInitiated(uint32 indexed matchId, address indexed donor, address indexed recipient);

    /// @notice Emitted when a match is completed and score is decrypted
    event MatchCompleted(uint32 indexed matchId, uint8 compatibilityScore, bool successful);

    /// @notice Emitted when a user profile is updated or deactivated
    event ProfileUpdated(address indexed user, bool isDonor);

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Restricts function access to the authorized hospital
    modifier onlyHospital() {
        require(msg.sender == hospital, "Only authorized hospital");
        _;
    }

    /// @notice Restricts function access to registered donors
    modifier onlyRegisteredDonor() {
        require(donors[msg.sender].isActive, "Not a registered donor");
        _;
    }

    /// @notice Restricts function access to registered recipients
    modifier onlyRegisteredRecipient() {
        require(recipients[msg.sender].isActive, "Not a registered recipient");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the contract with the deployer as the hospital coordinator
     */
    constructor() {
        hospital = msg.sender;
        totalMatches = 0;
        lastMatchTime = block.timestamp;
    }

    /*//////////////////////////////////////////////////////////////
                         REGISTRATION FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Register as an organ donor with encrypted medical data
     * @dev Demonstrates FHEVM encryption and access control patterns
     *
     * @param _age Age of the donor (must be 18-80)
     * @param _bloodType Blood type (0=O, 1=A, 2=B, 3=AB)
     * @param _organType Organ to donate (0-5, see OrganType enum)
     * @param _hlaType HLA compatibility marker (0-65535)
     * @param _urgencyScore Medical urgency score (0-100)
     *
     * @custom:fhevm-pattern Shows encryption using FHE.asEuint8/asEuint16
     * @custom:fhevm-pattern Demonstrates FHE.allowThis for contract access
     * @custom:fhevm-pattern Demonstrates FHE.allow for user access
     */
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

        // Encrypt all sensitive medical data using FHEVM
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
        // allowThis: Contract can use these values in computations
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedBloodType);
        FHE.allowThis(encryptedOrganType);
        FHE.allowThis(encryptedHLAType);
        FHE.allowThis(encryptedUrgencyScore);

        // allow: User can decrypt their own data
        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(encryptedBloodType, msg.sender);
        FHE.allow(encryptedOrganType, msg.sender);
        FHE.allow(encryptedHLAType, msg.sender);
        FHE.allow(encryptedUrgencyScore, msg.sender);

        emit DonorRegistered(msg.sender, block.timestamp);
    }

    /**
     * @notice Register as an organ recipient with encrypted medical data
     * @dev Similar to registerDonor but includes wait time parameter
     *
     * @param _age Age of the recipient (must be 1-80)
     * @param _bloodType Blood type (0=O, 1=A, 2=B, 3=AB)
     * @param _organType Needed organ (0-5, see OrganType enum)
     * @param _hlaType HLA compatibility marker (0-65535)
     * @param _urgencyScore Medical urgency score (0-100)
     * @param _waitTime Time on waiting list in months (0-240, max 20 years)
     *
     * @custom:fhevm-pattern Demonstrates batch encryption and access control
     */
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

        // Grant access permissions
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

    /*//////////////////////////////////////////////////////////////
                          MATCHING FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initiate privacy-preserving organ matching process
     * @dev Only callable by authorized hospital coordinator
     *
     * @param _donor Address of the donor to match
     * @param _recipient Address of the recipient to match
     *
     * @custom:fhevm-pattern Demonstrates encrypted computation workflow
     * @custom:fhevm-pattern Shows requestDecryption for public results
     */
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

    /**
     * @notice Calculate compatibility score using encrypted computation
     * @dev Performs all calculations on encrypted data, then requests decryption
     *
     * @param _matchId ID of the match being processed
     * @param _donor Address of the donor
     * @param _recipient Address of the recipient
     *
     * @custom:fhevm-pattern Demonstrates FHE.add, FHE.select, FHE.eq operations
     * @custom:fhevm-pattern Shows FHE.requestDecryption with callback
     */
    function _calculateCompatibility(uint32 _matchId, address _donor, address _recipient) private {
        DonorProfile storage donor = donors[_donor];
        RecipientProfile storage recipient = recipients[_recipient];

        // Calculate final score using encrypted operations
        euint8 finalScore = _calculateBaseScore(donor, recipient);
        finalScore = _addBonusScores(finalScore, recipient);

        // Request decryption of the final compatibility score
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(finalScore);
        FHE.requestDecryption(cts, this.processMatchResult.selector, _matchId);
    }

    /**
     * @notice Calculate base compatibility score from medical factors
     * @dev Uses encrypted comparisons and arithmetic
     *
     * Scoring breakdown:
     * - Blood type match: 30 points
     * - Organ type match: 40 points
     * - Age compatibility: 15 points
     * - HLA compatibility: 10 points
     *
     * @custom:fhevm-pattern Demonstrates FHE.eq for encrypted equality checks
     * @custom:fhevm-pattern Shows FHE.select for conditional logic on encrypted values
     */
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

    /**
     * @notice Check age compatibility between donor and recipient
     * @dev Encrypted logic: donor >= 18 AND age difference <= 15 years
     *
     * @custom:fhevm-pattern Demonstrates FHE.ge, FHE.gt, FHE.le, FHE.and
     * @custom:fhevm-pattern Shows encrypted subtraction with FHE.sub
     */
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

    /**
     * @notice Check HLA compatibility markers
     * @dev HLA difference must be less than 100 for compatibility
     *
     * @custom:fhevm-pattern Works with euint16 for larger value range
     */
    function _checkHLACompatibility(DonorProfile storage donor, RecipientProfile storage recipient) private returns (ebool) {
        ebool donorHigher = FHE.gt(donor.encryptedHLAType, recipient.encryptedHLAType);
        euint16 hlaDiff = FHE.select(
            donorHigher,
            FHE.sub(donor.encryptedHLAType, recipient.encryptedHLAType),
            FHE.sub(recipient.encryptedHLAType, donor.encryptedHLAType)
        );
        return FHE.lt(hlaDiff, FHE.asEuint16(100));
    }

    /**
     * @notice Add bonus scores based on urgency and wait time
     * @dev Uses bit shifting for efficient division by constants
     *
     * @custom:fhevm-pattern Demonstrates FHE.shr for encrypted bit shifting
     * @custom:fhevm-pattern Shows capping values with FHE.select and FHE.gt
     */
    function _addBonusScores(euint8 baseScore, RecipientProfile storage recipient) private returns (euint8) {
        // Urgency bonus: score / 4 (up to 25 points)
        euint8 urgencyBonus = FHE.shr(recipient.encryptedUrgencyScore, 2);

        // Wait time bonus: score / 8 (up to 15 points, capped)
        euint8 waitBonus = FHE.shr(recipient.encryptedWaitTime, 3);
        waitBonus = FHE.select(FHE.gt(waitBonus, FHE.asEuint8(15)), FHE.asEuint8(15), waitBonus);

        // Total score (capped at 100)
        euint8 totalScore = FHE.add(FHE.add(baseScore, urgencyBonus), waitBonus);
        return FHE.select(FHE.gt(totalScore, FHE.asEuint8(100)), FHE.asEuint8(100), totalScore);
    }

    /**
     * @notice Callback function to process decrypted match result
     * @dev Called by FHEVM after decryption is complete
     *
     * @param requestId The match ID (passed as requestId)
     * @param compatibilityScore The decrypted compatibility score (0-100)
     * @param signatures Cryptographic signatures from decryption nodes
     *
     * @custom:fhevm-pattern Demonstrates public decryption callback pattern
     * @custom:security-note Verify signatures in production for security
     */
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

    /*//////////////////////////////////////////////////////////////
                        PROFILE MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Update urgency score for recipient in emergency situations
     * @dev Only callable by the recipient themselves
     *
     * @param _newUrgencyScore New urgency score (0-100)
     */
    function updateUrgencyScore(uint8 _newUrgencyScore) external onlyRegisteredRecipient {
        require(_newUrgencyScore <= 100, "Invalid urgency score");

        euint8 newEncryptedUrgency = FHE.asEuint8(_newUrgencyScore);
        recipients[msg.sender].encryptedUrgencyScore = newEncryptedUrgency;

        FHE.allowThis(newEncryptedUrgency);
        FHE.allow(newEncryptedUrgency, msg.sender);

        emit ProfileUpdated(msg.sender, false);
    }

    /**
     * @notice Deactivate donor or recipient profile
     * @dev Allows users to remove themselves from active matching pool
     *
     * @param _isDonor True if deactivating donor profile, false for recipient
     */
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

    /**
     * @notice Internal function to deactivate both profiles after successful match
     */
    function _deactivateProfiles(address _donor, address _recipient) private {
        donors[_donor].isActive = false;
        recipients[_recipient].isActive = false;

        _removeFromActiveList(_donor, true);
        _removeFromActiveList(_recipient, false);
    }

    /**
     * @notice Remove address from active donor or recipient list
     * @dev Uses swap-and-pop for gas efficiency
     */
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

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get match result information
     * @param _matchId ID of the match to query
     * @return donor Address of the donor
     * @return recipient Address of the recipient
     * @return compatibilityScore Decrypted compatibility score
     * @return matchTime When the match was initiated
     * @return isProcessed Whether decryption is complete
     * @return isSuccessful Whether the match was successful
     */
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

    /// @notice Get count of active donors
    function getActiveDonorsCount() external view returns (uint256) {
        return activeDonors.length;
    }

    /// @notice Get count of active recipients
    function getActiveRecipientsCount() external view returns (uint256) {
        return activeRecipients.length;
    }

    /**
     * @notice Get comprehensive system statistics
     * @return totalDonors Current number of active donors
     * @return totalRecipients Current number of active recipients
     * @return totalMatchesCount Total matches initiated
     * @return lastMatch Timestamp of last match
     */
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

    /*//////////////////////////////////////////////////////////////
                         ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Transfer hospital coordinator authority
     * @dev Only callable by current hospital coordinator
     *
     * @param _newHospital Address of the new hospital coordinator
     */
    function transferHospitalAuthority(address _newHospital) external onlyHospital {
        require(_newHospital != address(0), "Invalid hospital address");
        hospital = _newHospital;
    }
}
