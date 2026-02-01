
export interface HomeownersInput {
    homeValue: number;
    state: string;
    homeType: 'single-family' | 'condo' | 'townhouse' | 'mobile';
    coverageLevel: 'basic' | 'standard' | 'premium';
}

export interface HomeownersResult {
    monthlyPremium: number;
    annualPremium: number;
    coverageSummary: string[];
    ratingFactors: string[];
    coverageDetails: { label: string; included: boolean }[];
}

// Base rate per $1000 of home value
const BASE_RATE_PER_1000: Record<HomeownersInput['coverageLevel'], number> = {
    'basic': 3.50,
    'standard': 5.00,
    'premium': 7.50
};

// State multipliers (based on weather/disaster risk)
const STATE_MULTIPLIERS: Record<string, number> = {
    'FL': 1.80, 'LA': 1.75, 'TX': 1.45, 'OK': 1.40, 'KS': 1.35,
    'MS': 1.30, 'AL': 1.25, 'SC': 1.20, 'NC': 1.15, 'GA': 1.12,
    'CA': 1.35, 'CO': 1.10, 'AZ': 1.05, 'NV': 1.00, 'NM': 1.00,
    'NY': 1.08, 'NJ': 1.10, 'PA': 0.95, 'OH': 0.92, 'MI': 0.95,
    'IL': 0.98, 'WI': 0.90, 'MN': 0.88, 'IA': 0.85, 'IN': 0.90,
    'VT': 0.82, 'NH': 0.85, 'ME': 0.88, 'ID': 0.80, 'OR': 0.95,
    'WA': 0.92, 'UT': 0.85,
    'DEFAULT': 1.00
};

// Home type multipliers
const HOME_TYPE_MULTIPLIERS: Record<HomeownersInput['homeType'], number> = {
    'single-family': 1.00,
    'condo': 0.65,
    'townhouse': 0.85,
    'mobile': 1.45
};

// Coverage descriptions
const COVERAGE_SUMMARIES: Record<HomeownersInput['coverageLevel'], string[]> = {
    'basic': [
        'Dwelling coverage for major perils',
        'Limited personal property protection',
        'Basic liability coverage',
        'Lower premiums, higher deductibles'
    ],
    'standard': [
        'Comprehensive dwelling protection',
        'Personal property replacement cost',
        'Extended liability coverage',
        'Additional living expenses included'
    ],
    'premium': [
        'Guaranteed replacement cost coverage',
        'High-value personal property riders',
        'Umbrella liability protection',
        'Water backup and service line coverage'
    ]
};

// Rating factors by home type
const RATING_FACTORS: Record<HomeownersInput['homeType'], string[]> = {
    'single-family': [
        'Full structure responsibility',
        'Lot size and outbuildings',
        'Roof age and condition',
        'Distance to fire station',
        'Home security systems'
    ],
    'condo': [
        'HOA master policy coverage',
        'Unit-only interior coverage',
        'Shared structure exclusions',
        'Assessment coverage options',
        'Lower overall exposure'
    ],
    'townhouse': [
        'Shared wall considerations',
        'Individual structure portions',
        'HOA common area factors',
        'Fire spread risk',
        'Foundation responsibility'
    ],
    'mobile': [
        'Specialized construction risk',
        'Wind/storm vulnerability',
        'Anchoring requirements',
        'Transportation damage history',
        'Limited insurer availability'
    ]
};

// Coverage details by level
const COVERAGE_DETAILS: Record<HomeownersInput['coverageLevel'], { label: string; included: boolean }[]> = {
    'basic': [
        { label: 'Dwelling Coverage', included: true },
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Additional Living Expenses', included: false },
        { label: 'Water Backup', included: false },
        { label: 'Scheduled Valuables', included: false }
    ],
    'standard': [
        { label: 'Dwelling Coverage', included: true },
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Additional Living Expenses', included: true },
        { label: 'Water Backup', included: false },
        { label: 'Scheduled Valuables', included: false }
    ],
    'premium': [
        { label: 'Dwelling Coverage', included: true },
        { label: 'Personal Property', included: true },
        { label: 'Liability Protection', included: true },
        { label: 'Additional Living Expenses', included: true },
        { label: 'Water Backup', included: true },
        { label: 'Scheduled Valuables', included: true }
    ]
};

export function calculateHomeownersInsurance(input: HomeownersInput): HomeownersResult {
    const ratePerThousand = BASE_RATE_PER_1000[input.coverageLevel];
    const stateMultiplier = STATE_MULTIPLIERS[input.state] || STATE_MULTIPLIERS['DEFAULT'];
    const homeTypeMultiplier = HOME_TYPE_MULTIPLIERS[input.homeType];

    const baseAnnual = (input.homeValue / 1000) * ratePerThousand;
    const annualPremium = Math.round(baseAnnual * stateMultiplier * homeTypeMultiplier);
    const monthlyPremium = Math.round(annualPremium / 12);

    return {
        monthlyPremium,
        annualPremium,
        coverageSummary: COVERAGE_SUMMARIES[input.coverageLevel],
        ratingFactors: RATING_FACTORS[input.homeType],
        coverageDetails: COVERAGE_DETAILS[input.coverageLevel]
    };
}
