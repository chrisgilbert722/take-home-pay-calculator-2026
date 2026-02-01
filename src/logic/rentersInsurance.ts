
export interface RentersInput {
    personalPropertyValue: number;
    state: string;
    unitType: 'apartment' | 'house' | 'condo' | 'room';
    coverageLevel: 'basic' | 'standard' | 'premium';
}

export interface RentersResult {
    monthlyPremium: number;
    annualPremium: number;
    coverageSummary: string[];
    ratingFactors: string[];
    coverageDetails: { label: string; included: boolean }[];
}

// Base annual rates by coverage level
const BASE_RATES: Record<RentersInput['coverageLevel'], number> = {
    'basic': 144,     // ~$12/month
    'standard': 216,  // ~$18/month
    'premium': 324    // ~$27/month
};

// Additional rate per $1000 of personal property over $20,000
const RATE_PER_1000_OVER_BASE = 0.50;
const BASE_PROPERTY_VALUE = 20000;

// State multipliers
const STATE_MULTIPLIERS: Record<string, number> = {
    'FL': 1.45, 'LA': 1.40, 'TX': 1.25, 'OK': 1.20, 'MS': 1.18,
    'AL': 1.15, 'GA': 1.12, 'SC': 1.10, 'NC': 1.08, 'TN': 1.05,
    'CA': 1.20, 'NY': 1.15, 'NJ': 1.12, 'MA': 1.08, 'CT': 1.05,
    'PA': 0.98, 'OH': 0.95, 'MI': 0.98, 'IL': 1.00, 'WI': 0.92,
    'MN': 0.90, 'IA': 0.88, 'IN': 0.92, 'MO': 0.95, 'CO': 1.02,
    'AZ': 1.00, 'NV': 0.98, 'WA': 0.95, 'OR': 0.92, 'UT': 0.90,
    'ID': 0.85, 'VT': 0.88, 'NH': 0.90, 'ME': 0.92,
    'DEFAULT': 1.00
};

// Unit type multipliers
const UNIT_TYPE_MULTIPLIERS: Record<RentersInput['unitType'], number> = {
    'apartment': 1.00,
    'house': 1.15,
    'condo': 0.95,
    'room': 0.80
};

// Coverage descriptions
const COVERAGE_SUMMARIES: Record<RentersInput['coverageLevel'], string[]> = {
    'basic': [
        'Personal property protection',
        'Basic liability coverage ($100k)',
        'Named perils only coverage',
        'Most affordable option'
    ],
    'standard': [
        'Personal property replacement cost',
        'Higher liability limits ($300k)',
        'Additional living expenses',
        'Broader peril coverage'
    ],
    'premium': [
        'Extended replacement cost',
        'Maximum liability ($500k)',
        'Identity theft protection',
        'Valuable items coverage'
    ]
};

// Rating factors by unit type
const RATING_FACTORS: Record<RentersInput['unitType'], string[]> = {
    'apartment': [
        'Multi-unit building factors',
        'Floor level considerations',
        'Building security features',
        'Sprinkler system presence',
        'Proximity to neighbors'
    ],
    'house': [
        'Single-family rental exposure',
        'Yard/outdoor liability',
        'Larger square footage',
        'Detached structure risks',
        'Property maintenance factors'
    ],
    'condo': [
        'HOA insurance overlap',
        'Unit-specific coverage',
        'Shared amenity access',
        'Building age factors',
        'Association rules compliance'
    ],
    'room': [
        'Shared living space',
        'Limited liability exposure',
        'Roommate considerations',
        'Reduced coverage needs',
        'Personal space limits'
    ]
};

// Coverage details by level
const COVERAGE_DETAILS: Record<RentersInput['coverageLevel'], { label: string; included: boolean }[]> = {
    'basic': [
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Medical Payments', included: true },
        { label: 'Additional Living Expenses', included: false },
        { label: 'Identity Theft', included: false },
        { label: 'Valuable Items Rider', included: false }
    ],
    'standard': [
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Medical Payments', included: true },
        { label: 'Additional Living Expenses', included: true },
        { label: 'Identity Theft', included: false },
        { label: 'Valuable Items Rider', included: false }
    ],
    'premium': [
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Medical Payments', included: true },
        { label: 'Additional Living Expenses', included: true },
        { label: 'Identity Theft', included: true },
        { label: 'Valuable Items Rider', included: true }
    ]
};

export function calculateRentersInsurance(input: RentersInput): RentersResult {
    let baseRate = BASE_RATES[input.coverageLevel];

    // Add extra for high-value personal property
    if (input.personalPropertyValue > BASE_PROPERTY_VALUE) {
        const extraThousands = (input.personalPropertyValue - BASE_PROPERTY_VALUE) / 1000;
        baseRate += extraThousands * RATE_PER_1000_OVER_BASE;
    }

    const stateMultiplier = STATE_MULTIPLIERS[input.state] || STATE_MULTIPLIERS['DEFAULT'];
    const unitTypeMultiplier = UNIT_TYPE_MULTIPLIERS[input.unitType];

    const annualPremium = Math.round(baseRate * stateMultiplier * unitTypeMultiplier);
    const monthlyPremium = Math.round(annualPremium / 12);

    return {
        monthlyPremium,
        annualPremium,
        coverageSummary: COVERAGE_SUMMARIES[input.coverageLevel],
        ratingFactors: RATING_FACTORS[input.unitType],
        coverageDetails: COVERAGE_DETAILS[input.coverageLevel]
    };
}
