import React from 'react';
import type { InsuranceResult } from '../logic/insuranceCalculations';

interface ResultsPanelProps {
    result: InsuranceResult;
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result }) => {
    return (
        <div className="card" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
            <div className="text-center">
                <h2 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    Estimated Monthly Insurance Cost
                </h2>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {formatCurrency(result.monthlyPremium)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                    per month
                </div>
            </div>

            <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL COST</div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{formatCurrency(result.annualPremium)}</div>
                </div>
                <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>COVERAGE</div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-accent)' }}>
                        {result.coverageDetails.filter(d => d.included).length} of {result.coverageDetails.length}
                    </div>
                </div>
            </div>
        </div>
    );
};
