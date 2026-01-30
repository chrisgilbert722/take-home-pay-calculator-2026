
export interface TaxInput {
    annualSalary: number;
    payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
    filingStatus: 'single' | 'married' | 'head';
    state: string; // US State code
    preTaxDeductions: number; // Annual amount
    overtimeHours: number; // Per pay period
    overtimeRate: number; // Usually 1.5x
    bonus: number; // Annual bonus
}

export interface TaxResult {
    grossPayPerCheck: number;
    federalTaxPerCheck: number;
    stateTaxPerCheck: number;
    ficaPerCheck: number;
    netPayPerCheck: number;

    monthlyNetPay: number;
    annualNetPay: number;
    effectiveTaxRate: number;
}

const PAY_PERIODS = {
    'weekly': 52,
    'bi-weekly': 26,
    'semi-monthly': 24,
    'monthly': 12
};

// Simplified 2026 Federal Brackets (Provisional)
// Using standard progressive steps for Single/Married
const FEDERAL_BRACKETS_2026 = {
    single: [
        { limit: 11925, rate: 0.10 },
        { limit: 48475, rate: 0.12 },
        { limit: 103350, rate: 0.22 },
        { limit: 197300, rate: 0.24 },
        { limit: 250525, rate: 0.32 },
        { limit: 626350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
    ],
    married: [
        { limit: 23850, rate: 0.10 },
        { limit: 96950, rate: 0.12 },
        { limit: 206700, rate: 0.22 },
        { limit: 394600, rate: 0.24 },
        { limit: 501050, rate: 0.32 },
        { limit: 751600, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
    ],
    head: [
        { limit: 17000, rate: 0.10 },
        { limit: 64850, rate: 0.12 },
        { limit: 103350, rate: 0.22 },
        { limit: 197300, rate: 0.24 },
        { limit: 250500, rate: 0.32 },
        { limit: 626350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
    ]
};

// Standard Deduction 2026 (Provisional)
const STANDARD_DEDUCTION = {
    single: 15000,
    married: 30000,
    head: 22500
};

// Generic simplified state tax for "Estimated State Tax (Simplified)"
// In a real app, this would be a map of state -> brackets
const SIMPLIFIED_STATE_RATE = 0.045; // 4.5% flat estimate for simplified view

export function calculateTakeHome(input: TaxInput): TaxResult {
    const periods = PAY_PERIODS[input.payFrequency];

    // 1. Calculate Gross
    let annualGross = input.annualSalary;

    // Add Bonus
    annualGross += input.bonus;

    // Add Overtime (Annualized)
    // Logic: (Hourly Rate * 1.5) * Hours * Periods
    // Hourly Rate approx = Salary / 2080 (standard work year)
    // This is a simplified estimation for the calculator
    if (input.overtimeHours > 0) {
        const hourlyRate = input.annualSalary / 2080;
        const otPayPerPeriod = (hourlyRate * input.overtimeRate) * input.overtimeHours;
        annualGross += (otPayPerPeriod * periods);
    }

    // 2. Taxable Income
    // Subtract Pre-tax deductions
    let taxableStrata = annualGross - input.preTaxDeductions;

    // Subtract Standard Deduction
    const deduct = STANDARD_DEDUCTION[input.filingStatus];
    taxableStrata = Math.max(0, taxableStrata - deduct);

    // 3. Federal Tax
    let fedTax = 0;
    let remainingInput = taxableStrata;
    let prevLimit = 0;
    const brackets = FEDERAL_BRACKETS_2026[input.filingStatus];

    for (const bracket of brackets) {
        const width = bracket.limit - prevLimit;
        const taxableAtThisRate = Math.min(remainingInput, width);

        if (taxableAtThisRate > 0) {
            fedTax += taxableAtThisRate * bracket.rate;
            remainingInput -= taxableAtThisRate;
        }
        prevLimit = bracket.limit;
    }

    // 4. FICA (Social Security + Medicare)
    // SS: 6.2% up to ~$176,100 (2025/2026 est)
    // Medicare: 1.45% unlimited
    const SS_LIMIT = 176100;
    const ssTax = Math.min(annualGross, SS_LIMIT) * 0.062;
    const medTax = annualGross * 0.0145;
    const ficaTotal = ssTax + medTax;

    // 5. State Tax (Simplified)
    // Apply to (Gross - Deductions) typically, but simplified: Gross * Rate
    // For better accuracy in simplified mode without complex logic, we'll strict it to taxable approx
    const stateTax = Math.max(0, (annualGross - input.preTaxDeductions - 2000)) * SIMPLIFIED_STATE_RATE;
    // 2000 is a generic arbitrary exemption to avoid taxing very low income in simplified mode

    // 6. Net
    const annualNet = annualGross - fedTax - ficaTotal - stateTax;

    // 7. Per Check
    const grossPerCheck = annualGross / periods;
    const fedPerCheck = fedTax / periods;
    const statePerCheck = stateTax / periods;
    const ficaPerCheck = ficaTotal / periods;
    const netPerCheck = annualNet / periods;

    // 8. Effective Rate
    const effectiveRate = annualGross > 0 ? ((annualGross - annualNet) / annualGross) * 100 : 0;

    return {
        grossPayPerCheck: grossPerCheck,
        federalTaxPerCheck: fedPerCheck,
        stateTaxPerCheck: statePerCheck,
        ficaPerCheck: ficaPerCheck,
        netPayPerCheck: netPerCheck,
        monthlyNetPay: annualNet / 12,
        annualNetPay: annualNet,
        effectiveTaxRate: effectiveRate
    };
}
