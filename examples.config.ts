/**
 * FHEVM Examples Configuration
 *
 * This file defines available FHEVM example projects that can be generated.
 * Each example includes metadata, FHEVM patterns, and categorization.
 */

export interface ExampleMetadata {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    contractName: string;
    contractFile: string;
    testFile: string;
    fhevmPatterns: FHEVMPattern[];
    keywords: string[];
    author: string;
    version: string;
    license: string;
    gasEstimates: {
        deployment: number;
        register: number;
        matching: number;
    };
}

export interface FHEVMPattern {
    name: string;
    description: string;
    code: string;
}

/**
 * FHEVM Examples Configuration
 */
export const EXAMPLES: Record<string, ExampleMetadata> = {
    'private-organ-matching': {
        id: 'private-organ-matching',
        name: 'Private Organ Matching',
        description: 'A production-grade FHEVM example demonstrating privacy-preserving organ donor-recipient matching. This system enables secure medical data processing on blockchain while maintaining complete patient privacy through homomorphic encryption.',
        shortDescription: 'Privacy-preserving organ donor matching using encrypted medical data',
        category: 'Healthcare',
        difficulty: 'intermediate',
        contractName: 'PrivateOrganMatching',
        contractFile: 'contracts/PrivateOrganMatching.sol',
        testFile: 'test/PrivateOrganMatching.test.ts',
        fhevmPatterns: [
            {
                name: 'Encrypted Data Storage',
                description: 'Store sensitive medical data encrypted on-chain using euint8 and euint16 types',
                code: 'euint8 encryptedAge = FHE.asEuint8(_age);'
            },
            {
                name: 'Access Control',
                description: 'Grant permissions using FHE.allowThis() and FHE.allow() patterns',
                code: 'FHE.allowThis(encryptedAge);\nFHE.allow(encryptedAge, msg.sender);'
            },
            {
                name: 'Encrypted Arithmetic',
                description: 'Perform mathematical operations on encrypted values without decryption',
                code: 'euint8 sum = FHE.add(value1, value2);\neuint8 diff = FHE.sub(value1, value2);'
            },
            {
                name: 'Encrypted Comparisons',
                description: 'Compare encrypted values using eq, lt, gt, le, ge operations',
                code: 'ebool isEqual = FHE.eq(donor.bloodType, recipient.bloodType);\nebool compatible = FHE.gt(value1, value2);'
            },
            {
                name: 'Conditional Logic',
                description: 'Implement if/else logic on encrypted values using FHE.select()',
                code: 'euint8 points = FHE.select(\n    FHE.eq(type1, type2),\n    FHE.asEuint8(30),\n    FHE.asEuint8(0)\n);'
            },
            {
                name: 'Public Decryption',
                description: 'Request decryption of computed results using callback pattern',
                code: 'FHE.requestDecryption(\n    cts,\n    this.processMatchResult.selector,\n    matchId\n);'
            },
            {
                name: 'Logical Operations',
                description: 'Combine encrypted boolean conditions using AND, OR operations',
                code: 'ebool result = FHE.and(condition1, condition2);\nebool result2 = FHE.or(condition1, condition2);'
            }
        ],
        keywords: [
            'healthcare',
            'privacy',
            'medical-data',
            'homomorphic-encryption',
            'encrypted-computation',
            'access-control',
            'real-world-application'
        ],
        author: 'Zama Community',
        version: '1.0.0',
        license: 'MIT',
        gasEstimates: {
            deployment: 2150000,
            register: 180000,
            matching: 240000
        }
    }
};

/**
 * Get all available categories
 */
export function getCategories(): string[] {
    return [...new Set(Object.values(EXAMPLES).map(ex => ex.category))];
}

/**
 * Get examples by category
 */
export function getExamplesByCategory(category: string): ExampleMetadata[] {
    return Object.values(EXAMPLES).filter(ex => ex.category === category);
}

/**
 * Get example by ID
 */
export function getExample(id: string): ExampleMetadata | undefined {
    return EXAMPLES[id];
}

/**
 * Get all examples
 */
export function getAllExamples(): ExampleMetadata[] {
    return Object.values(EXAMPLES);
}

/**
 * Search examples by keyword
 */
export function searchExamples(keyword: string): ExampleMetadata[] {
    const lowerKeyword = keyword.toLowerCase();
    return Object.values(EXAMPLES).filter(ex =>
        ex.name.toLowerCase().includes(lowerKeyword) ||
        ex.description.toLowerCase().includes(lowerKeyword) ||
        ex.keywords.some(k => k.includes(lowerKeyword))
    );
}

/**
 * Get examples by difficulty level
 */
export function getExamplesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ExampleMetadata[] {
    return Object.values(EXAMPLES).filter(ex => ex.difficulty === difficulty);
}

/**
 * Export all configurations
 */
export const config = {
    examples: EXAMPLES,
    categories: getCategories(),
    totalExamples: Object.keys(EXAMPLES).length,
    version: '1.0.0',
    fhevmVersion: '0.4.0',
    hardhatVersion: '2.19.5'
};

export default EXAMPLES;
