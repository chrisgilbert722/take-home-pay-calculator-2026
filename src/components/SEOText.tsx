import React from 'react';

export const SEOText: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p>
                Use this 2026 take-home pay calculator to generate instant estimates of your net paycheck earnings.
                While these figures help with budgeting, actual take-home amounts may vary by employer due to
                specific payroll processing, benefits, and rounding. Please note this tool is for informational
                purposes only and is not tax advice. We use simplified models for federal and state withholdings
                to provide a fast overview. For precise tax liability, consult a qualified professional.
            </p>
        </div>
    );
};
