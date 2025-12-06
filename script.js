// Contract configuration - UPDATE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0x037AfED8971a7346772065fd492090026eFc9dcb";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DonorRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint32",
                "name": "matchId",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "compatibilityScore",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "successful",
                "type": "bool"
            }
        ],
        "name": "MatchCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint32",
                "name": "matchId",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            }
        ],
        "name": "MatchInitiated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isDonor",
                "type": "bool"
            }
        ],
        "name": "ProfileUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "RecipientRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "activeDonors",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "activeRecipients",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_isDonor",
                "type": "bool"
            }
        ],
        "name": "deactivateProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "donors",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "registrationTime",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "donorAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getActiveDonorsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getActiveRecipientsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_matchId",
                "type": "uint32"
            }
        ],
        "name": "getMatchResult",
        "outputs": [
            {
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "compatibilityScore",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "matchTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isProcessed",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isSuccessful",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSystemStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalDonors",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalRecipients",
                "type": "uint256"
            },
            {
                "internalType": "uint32",
                "name": "totalMatchesCount",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "lastMatch",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "hospital",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_donor",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_recipient",
                "type": "address"
            }
        ],
        "name": "initiateMatching",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastMatchTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "name": "matches",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "matchId",
                "type": "uint32"
            },
            {
                "internalType": "address",
                "name": "donorAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipientAddress",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "compatibilityScore",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "matchTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isProcessed",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isSuccessful",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestId",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "compatibilityScore",
                "type": "uint8"
            },
            {
                "internalType": "bytes[]",
                "name": "signatures",
                "type": "bytes[]"
            }
        ],
        "name": "processMatchResult",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "recipients",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "registrationTime",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "recipientAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_age",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_bloodType",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_organType",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "_hlaType",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "_urgencyScore",
                "type": "uint8"
            }
        ],
        "name": "registerDonor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_age",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_bloodType",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_organType",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "_hlaType",
                "type": "uint16"
            },
            {
                "internalType": "uint8",
                "name": "_urgencyScore",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_waitTime",
                "type": "uint8"
            }
        ],
        "name": "registerRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalMatches",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newHospital",
                "type": "address"
            }
        ],
        "name": "transferHospitalAuthority",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "_newUrgencyScore",
                "type": "uint8"
            }
        ],
        "name": "updateUrgencyScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Global variables
let provider;
let signer;
let contract;
let userAccount;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        showToast('Error: ethers.js library failed to load. Please refresh the page.', 'error');
        console.error('Ethers library not loaded');
        return;
    }

    initializeEventListeners();
    await checkConnection();
    await loadSystemStats();
});

// Event listeners
function initializeEventListeners() {
    // Wallet connection
    document.getElementById('connectWallet').addEventListener('click', connectWallet);

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Form submissions
    document.getElementById('donorForm').addEventListener('submit', handleDonorRegistration);
    document.getElementById('recipientForm').addEventListener('submit', handleRecipientRegistration);
    document.getElementById('matchingForm').addEventListener('submit', handleMatching);
    document.getElementById('transferForm').addEventListener('submit', handleTransfer);
}

// Wallet connection
async function connectWallet() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            userAccount = accounts[0];

            // Check network first
            const network = await provider.getNetwork();
            if (network.chainId !== 11155111) { // Sepolia testnet
                showToast('Please switch to Sepolia testnet', 'warning');
                return;
            }

            // Check if contract address is valid
            if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
                showToast('Contract not deployed yet. Please update CONTRACT_ADDRESS in script.js', 'warning');
                updateWalletUI();
                return;
            }

            // Initialize contract
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            updateWalletUI();
            await loadSystemStats();
            showToast('Wallet connected successfully!', 'success');

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
        } else {
            showToast('Please install MetaMask', 'error');
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showToast('Failed to connect wallet', 'error');
    }
}

// Check if wallet is already connected
async function checkConnection() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts.length > 0) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                userAccount = accounts[0];

                // Initialize contract
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                updateWalletUI();
                await loadSystemStats();
            }
        }
    } catch (error) {
        console.error('Error checking connection:', error);
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected
        userAccount = null;
        provider = null;
        signer = null;
        contract = null;
        updateWalletUI();
    } else {
        // User switched accounts
        userAccount = accounts[0];
        updateWalletUI();
        loadSystemStats();
    }
}

// Update wallet UI
function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    const walletStatus = document.getElementById('walletStatus');
    const walletAddress = document.getElementById('walletAddress');

    if (userAccount) {
        connectBtn.textContent = 'Connected';
        connectBtn.disabled = true;
        walletStatus.style.display = 'block';
        walletAddress.textContent = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
    } else {
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
        walletStatus.style.display = 'none';
    }
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`).classList.add('active');
}

// Load system statistics
async function loadSystemStats() {
    try {
        if (!contract) {
            // Set default values when no contract
            document.getElementById('donorCount').textContent = '0';
            document.getElementById('recipientCount').textContent = '0';
            document.getElementById('matchCount').textContent = '0';
            document.getElementById('totalDonors').textContent = '0';
            document.getElementById('totalRecipients').textContent = '0';
            document.getElementById('totalMatches').textContent = '0';
            document.getElementById('lastMatch').textContent = 'Contract not connected';
            return;
        }

        const stats = await contract.getSystemStats();
        const donorsCount = await contract.getActiveDonorsCount();
        const recipientsCount = await contract.getActiveRecipientsCount();

        // Update header stats
        document.getElementById('donorCount').textContent = donorsCount.toString();
        document.getElementById('recipientCount').textContent = recipientsCount.toString();
        document.getElementById('matchCount').textContent = stats.totalMatchesCount.toString();

        // Update detailed stats
        document.getElementById('totalDonors').textContent = stats.totalDonors.toString();
        document.getElementById('totalRecipients').textContent = stats.totalRecipients.toString();
        document.getElementById('totalMatches').textContent = stats.totalMatchesCount.toString();

        const lastMatchDate = stats.lastMatch.toNumber() > 0
            ? new Date(stats.lastMatch.toNumber() * 1000).toLocaleString()
            : 'Never';
        document.getElementById('lastMatch').textContent = lastMatchDate;

    } catch (error) {
        console.error('Error loading stats:', error);
        // Set error state values
        document.getElementById('donorCount').textContent = 'Error';
        document.getElementById('recipientCount').textContent = 'Error';
        document.getElementById('matchCount').textContent = 'Error';
    }
}

// Handle donor registration
async function handleDonorRegistration(e) {
    e.preventDefault();

    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const formData = new FormData(e.target);
        const age = parseInt(document.getElementById('donorAge').value);
        const bloodType = parseInt(document.getElementById('donorBloodType').value);
        const organType = parseInt(document.getElementById('donorOrganType').value);
        const hlaType = parseInt(document.getElementById('donorHLA').value);
        const urgencyScore = parseInt(document.getElementById('donorUrgency').value);

        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        const tx = await contract.registerDonor(
            age,
            bloodType,
            organType,
            hlaType,
            urgencyScore
        );

        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();

        showToast('Successfully registered as donor!', 'success');
        e.target.reset();
        await loadSystemStats();

    } catch (error) {
        console.error('Error registering donor:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register as Donor';
    }
}

// Handle recipient registration
async function handleRecipientRegistration(e) {
    e.preventDefault();

    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const age = parseInt(document.getElementById('recipientAge').value);
        const bloodType = parseInt(document.getElementById('recipientBloodType').value);
        const organType = parseInt(document.getElementById('recipientOrganType').value);
        const hlaType = parseInt(document.getElementById('recipientHLA').value);
        const urgencyScore = parseInt(document.getElementById('recipientUrgency').value);
        const waitTime = parseInt(document.getElementById('recipientWaitTime').value);

        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        const tx = await contract.registerRecipient(
            age,
            bloodType,
            organType,
            hlaType,
            urgencyScore,
            waitTime
        );

        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();

        showToast('Successfully registered as recipient!', 'success');
        e.target.reset();
        await loadSystemStats();

    } catch (error) {
        console.error('Error registering recipient:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register as Recipient';
    }
}

// Handle matching
async function handleMatching(e) {
    e.preventDefault();

    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const donorAddress = document.getElementById('donorAddress').value;
        const recipientAddress = document.getElementById('recipientAddress').value;

        if (!ethers.utils.isAddress(donorAddress) || !ethers.utils.isAddress(recipientAddress)) {
            showToast('Please enter valid Ethereum addresses', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Initiating...';

        const tx = await contract.initiateMatching(donorAddress, recipientAddress);

        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();

        showToast('Matching process initiated successfully!', 'success');
        e.target.reset();
        await loadSystemStats();

    } catch (error) {
        console.error('Error initiating matching:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Initiate Matching';
    }
}

// Handle transfer
async function handleTransfer(e) {
    e.preventDefault();

    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const newHospitalAddress = document.getElementById('newHospitalAddress').value;

        if (!ethers.utils.isAddress(newHospitalAddress)) {
            showToast('Please enter a valid Ethereum address', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transferring...';

        const tx = await contract.transferHospitalAuthority(newHospitalAddress);

        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();

        showToast('Hospital authority transferred successfully!', 'success');
        e.target.reset();

    } catch (error) {
        console.error('Error transferring authority:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Transfer Authority';
    }
}

// Get match result
async function getMatchResult() {
    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const matchId = parseInt(document.getElementById('matchId').value);
        if (!matchId || matchId < 1) {
            showToast('Please enter a valid match ID', 'error');
            return;
        }

        const result = await contract.getMatchResult(matchId);

        const resultDisplay = document.getElementById('matchDetails');
        resultDisplay.innerHTML = `
            <strong>Match ID:</strong> ${matchId}<br>
            <strong>Donor:</strong> ${result.donor}<br>
            <strong>Recipient:</strong> ${result.recipient}<br>
            <strong>Compatibility Score:</strong> ${result.compatibilityScore}%<br>
            <strong>Match Time:</strong> ${new Date(result.matchTime.toNumber() * 1000).toLocaleString()}<br>
            <strong>Processed:</strong> ${result.isProcessed ? 'Yes' : 'No'}<br>
            <strong>Successful:</strong> ${result.isSuccessful ? 'Yes' : 'No'}
        `;

    } catch (error) {
        console.error('Error getting match result:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Update urgency score
async function updateUrgencyScore() {
    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    const newScore = prompt('Enter new urgency score (0-100):');
    if (newScore === null) return;

    const score = parseInt(newScore);
    if (isNaN(score) || score < 0 || score > 100) {
        showToast('Please enter a valid urgency score (0-100)', 'error');
        return;
    }

    try {
        const tx = await contract.updateUrgencyScore(score);
        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();
        showToast('Urgency score updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating urgency score:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Deactivate profile
async function deactivateProfile(isDonor) {
    if (!contract) {
        showToast('Please connect your wallet first', 'warning');
        return;
    }

    const profileType = isDonor ? 'donor' : 'recipient';
    if (!confirm(`Are you sure you want to deactivate your ${profileType} profile?`)) {
        return;
    }

    try {
        const tx = await contract.deactivateProfile(isDonor);
        showToast('Transaction submitted. Waiting for confirmation...', 'success');
        await tx.wait();
        showToast(`${profileType.charAt(0).toUpperCase() + profileType.slice(1)} profile deactivated successfully!`, 'success');
        await loadSystemStats();
    } catch (error) {
        console.error('Error deactivating profile:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Refresh statistics
async function refreshStats() {
    await loadSystemStats();
    showToast('Statistics refreshed!', 'success');
}

// Utility function to show toast messages
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Format address for display
function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Validate Ethereum address
function isValidAddress(address) {
    return ethers.utils.isAddress(address);
}

// Export functions for global access
window.getMatchResult = getMatchResult;
window.updateUrgencyScore = updateUrgencyScore;
window.deactivateProfile = deactivateProfile;
window.refreshStats = refreshStats;