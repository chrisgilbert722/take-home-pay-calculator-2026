
export interface WageInput {
    state: string; // US State code
    wageType: 'overtime' | 'minimum-wage' | 'commissions' | 'final-pay';
    payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
    timeSinceOwed: 'less-30' | '30-90' | '90-180' | '180-365' | 'over-365';
}

export interface WageResult {
    statusSummary: string;
    urgencyLevel: 'low' | 'moderate' | 'elevated' | 'high';
    wageCategories: string[];
    commonFactors: string[];
    timeConsiderations: string;
    stateNote: string;
}

const WAGE_TYPE_CATEGORIES: Record<WageInput['wageType'], string[]> = {
    'overtime': [
        'Hours worked over 40 per week',
        'Overtime rate calculations (1.5x or 2x)',
        'Exempt vs. non-exempt classification',
        'Compensatory time policies'
    ],
    'minimum-wage': [
        'Federal minimum wage compliance',
        'State minimum wage requirements',
        'Tip credit provisions',
        'Youth wage considerations'
    ],
    'commissions': [
        'Commission agreement terms',
        'Earned vs. paid commission timing',
        'Chargebacks and deductions',
        'Termination commission policies'
    ],
    'final-pay': [
        'Final paycheck timing requirements',
        'Accrued vacation/PTO payout',
        'Expense reimbursements',
        'Severance considerations'
    ]
};

const COMMON_FACTORS: Record<WageInput['wageType'], string[]> = {
    'overtime': [
        'FLSA overtime provisions',
        'State overtime laws',
        'Employee classification status',
        'Workweek definitions',
        'Regular rate calculations'
    ],
    'minimum-wage': [
        'Federal vs. state wage floor',
        'Industry-specific exemptions',
        'Piece rate considerations',
        'Training wage provisions',
        'Cost of living adjustments'
    ],
    'commissions': [
        'Written commission agreements',
        'Calculation methodology',
        'Payment timing terms',
        'Post-termination commissions',
        'Clawback provisions'
    ],
    'final-pay': [
        'State-specific timing laws',
        'Voluntary vs. involuntary separation',
        'PTO/vacation accrual policies',
        'Deduction limitations',
        'Wage claim filing deadlines'
    ]
};

const TIME_CONSIDERATIONS: Record<WageInput['timeSinceOwed'], { label: string; note: string }> = {
    'less-30': {
        label: 'Less than 30 days',
        note: 'Recent wage issues may still be within normal payroll correction windows. Many states require prompt payment but allow reasonable processing time.'
    },
    '30-90': {
        label: '30–90 days',
        note: 'Wage claims in this timeframe often fall within standard dispute resolution periods. Documentation of hours worked and pay records is typically still readily available.'
    },
    '90-180': {
        label: '90–180 days',
        note: 'Claims approaching this duration may warrant formal documentation. Many administrative complaint processes have filing windows to consider.'
    },
    '180-365': {
        label: '180 days–1 year',
        note: 'Extended wage disputes may involve additional considerations. Some states have specific statutes of limitations that begin to apply.'
    },
    'over-365': {
        label: 'Over 1 year',
        note: 'Long-standing wage issues require careful review of applicable limitation periods. Federal claims under FLSA generally have a 2-year statute (3 years for willful violations); state laws vary significantly.'
    }
};

const STATE_NOTES: Record<string, string> = {
    'CA': 'California has robust wage and hour protections, including waiting time penalties for late final pay.',
    'NY': 'New York has specific notice and recordkeeping requirements for wage claims.',
    'TX': 'Texas follows federal FLSA minimums; wage claims are typically filed with the Texas Workforce Commission.',
    'FL': 'Florida does not have a state labor department for wage claims; federal law primarily applies.',
    'IL': 'Illinois has its own minimum wage and overtime rules that may exceed federal requirements.',
    'PA': 'Pennsylvania has specific rules for final pay timing based on separation type.',
    'OH': 'Ohio wage claims can be pursued through the state or federal channels.',
    'GA': 'Georgia primarily follows federal FLSA standards for wage and hour matters.',
    'NC': 'North Carolina requires timely wage payment and has specific final pay rules.',
    'MI': 'Michigan has a state minimum wage and specific rules for commission agreements.',
    'DEFAULT': 'Your state may have specific wage and hour laws. Laws vary by state, and consulting your state labor department or a qualified professional is recommended.'
};

function getUrgencyLevel(timeSinceOwed: WageInput['timeSinceOwed']): WageResult['urgencyLevel'] {
    switch (timeSinceOwed) {
        case 'less-30': return 'low';
        case '30-90': return 'moderate';
        case '90-180': return 'elevated';
        case '180-365':
        case 'over-365': return 'high';
        default: return 'moderate';
    }
}

function getStatusSummary(input: WageInput): string {
    const typeLabels: Record<WageInput['wageType'], string> = {
        'overtime': 'overtime wages',
        'minimum-wage': 'minimum wage compliance',
        'commissions': 'commission payments',
        'final-pay': 'final pay'
    };

    const timeLabel = TIME_CONSIDERATIONS[input.timeSinceOwed].label.toLowerCase();
    const wageLabel = typeLabels[input.wageType];

    return `Based on your inputs, you may have an unpaid ${wageLabel} claim for wages owed ${timeLabel}. This eligibility check highlights potential wage categories and key legal factors. Eligibility depends on state law and specific circumstances—this is not a legal determination.`;
}

export function estimateWageSituation(input: WageInput): WageResult {
    const stateNote = STATE_NOTES[input.state] || STATE_NOTES['DEFAULT'];

    return {
        statusSummary: getStatusSummary(input),
        urgencyLevel: getUrgencyLevel(input.timeSinceOwed),
        wageCategories: WAGE_TYPE_CATEGORIES[input.wageType],
        commonFactors: COMMON_FACTORS[input.wageType],
        timeConsiderations: TIME_CONSIDERATIONS[input.timeSinceOwed].note,
        stateNote
    };
}
