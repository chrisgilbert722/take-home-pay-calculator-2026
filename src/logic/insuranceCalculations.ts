
export interface InsuranceInput {
    driverAge: number;
    state: string;
    vehicleType: 'sedan' | 'suv' | 'truck' | 'sports' | 'luxury' | 'electric';
    coverageLevel: 'minimum' | 'standard' | 'full';
}

export interface InsuranceResult {
    monthlyPremium: number;
    annualPremium: number;
    coverageSummary: string[];
    ratingFactors: string[];
    coverageDetails: { label: string; included: boolean }[];
}

// Base annual rates by coverage level
const BASE_RATES: Record<InsuranceInput['coverageLevel'], number> = {
    'minimum': 840,    // ~$70/month
    'standard': 1440,  // ~$120/month
    'full': 2160       // ~$180/month
};

// Age multipliers - younger and older drivers pay more
function getAgeMultiplier(age: number): number {
    if (age < 20) return 1.85;
    if (age < 25) return 1.55;
    if (age < 30) return 1.20;
    if (age < 65) return 1.00;
    if (age < 75) return 1.15;
    return 1.35;
}

// State multipliers (simplified - based on average premiums)
const STATE_MULTIPLIERS: Record<string, number> = {
    'MI': 1.45, 'LA': 1.40, 'FL': 1.35, 'NY': 1.30, 'CA': 1.25,
    'NJ': 1.28, 'TX': 1.20, 'GA': 1.18, 'AZ': 1.15, 'CO': 1.12,
    'PA': 1.10, 'IL': 1.08, 'OH': 1.05, 'VA': 1.02, 'WA': 1.00,
    'NC': 0.98, 'TN': 0.95, 'IN': 0.92, 'WI': 0.90, 'IA': 0.88,
    'ID': 0.85, 'ME': 0.85, 'VT': 0.82, 'NH': 0.80,
    'DEFAULT': 1.00
};

// Vehicle type multipliers
const VEHICLE_MULTIPLIERS: Record<InsuranceInput['vehicleType'], number> = {
    'sedan': 1.00,
    'suv': 1.10,
    'truck': 1.08,
    'sports': 1.45,
    'luxury': 1.55,
    'electric': 1.15
};

// Coverage descriptions
const COVERAGE_SUMMARIES: Record<InsuranceInput['coverageLevel'], string[]> = {
    'minimum': [
        'State-required liability coverage only',
        'Covers damage you cause to others',
        'No coverage for your own vehicle',
        'Lowest premium, highest out-of-pocket risk'
    ],
    'standard': [
        'Liability plus collision coverage',
        'Covers damage to your vehicle in accidents',
        'Includes uninsured motorist protection',
        'Balanced coverage and cost'
    ],
    'full': [
        'Comprehensive liability and collision',
        'Covers theft, vandalism, weather damage',
        'Lower deductibles available',
        'Maximum protection, higher premium'
    ]
};

// Rating factors explanation
const RATING_FACTORS: Record<InsuranceInput['vehicleType'], string[]> = {
    'sedan': [
        'Standard vehicle classification',
        'Average repair costs',
        'Common replacement parts availability',
        'Moderate theft risk profile',
        'Typical safety ratings considered'
    ],
    'suv': [
        'Higher ride height considerations',
        'Increased repair costs',
        'Rollover risk factor',
        'Family vehicle safety credits possible',
        'Higher replacement value'
    ],
    'truck': [
        'Work vehicle classification',
        'Higher repair costs for body damage',
        'Usage pattern considerations',
        'Cargo liability factors',
        'Moderate theft risk'
    ],
    'sports': [
        'High-performance vehicle surcharge',
        'Increased accident risk statistics',
        'Expensive repair costs',
        'Higher theft target',
        'Speed-related claim frequency'
    ],
    'luxury': [
        'Premium vehicle classification',
        'Specialized repair requirements',
        'High replacement part costs',
        'Elevated theft risk',
        'Advanced technology repair costs'
    ],
    'electric': [
        'Specialized battery/drivetrain repairs',
        'Limited repair facility availability',
        'Higher replacement costs',
        'Emerging vehicle data considerations',
        'Potential eco-vehicle discounts'
    ]
};

// Coverage details by level
const COVERAGE_DETAILS: Record<InsuranceInput['coverageLevel'], { label: string; included: boolean }[]> = {
    'minimum': [
        { label: 'Bodily Injury Liability', included: true },
        { label: 'Property Damage Liability', included: true },
        { label: 'Collision Coverage', included: false },
        { label: 'Comprehensive Coverage', included: false },
        { label: 'Uninsured Motorist', included: false },
        { label: 'Medical Payments', included: false }
    ],
    'standard': [
        { label: 'Bodily Injury Liability', included: true },
        { label: 'Property Damage Liability', included: true },
        { label: 'Collision Coverage', included: true },
        { label: 'Comprehensive Coverage', included: false },
        { label: 'Uninsured Motorist', included: true },
        { label: 'Medical Payments', included: true }
    ],
    'full': [
        { label: 'Bodily Injury Liability', included: true },
        { label: 'Property Damage Liability', included: true },
        { label: 'Collision Coverage', included: true },
        { label: 'Comprehensive Coverage', included: true },
        { label: 'Uninsured Motorist', included: true },
        { label: 'Medical Payments', included: true }
    ]
};

export function calculateInsurance(input: InsuranceInput): InsuranceResult {
    const baseRate = BASE_RATES[input.coverageLevel];
    const ageMultiplier = getAgeMultiplier(input.driverAge);
    const stateMultiplier = STATE_MULTIPLIERS[input.state] || STATE_MULTIPLIERS['DEFAULT'];
    const vehicleMultiplier = VEHICLE_MULTIPLIERS[input.vehicleType];

    const annualPremium = Math.round(baseRate * ageMultiplier * stateMultiplier * vehicleMultiplier);
    const monthlyPremium = Math.round(annualPremium / 12);

    return {
        monthlyPremium,
        annualPremium,
        coverageSummary: COVERAGE_SUMMARIES[input.coverageLevel],
        ratingFactors: RATING_FACTORS[input.vehicleType],
        coverageDetails: COVERAGE_DETAILS[input.coverageLevel]
    };
}
