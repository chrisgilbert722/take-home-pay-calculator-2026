import React from 'react';
import type { TaxResult } from '../logic/taxCalculations';

interface ResultsPanelProps {
    result: TaxResult;
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
                    Estimated Take-Home Pay Per Paycheck
                </h2>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
                    {formatCurrency(result.netPayPerCheck)}
                </div>
            </div>

            <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid #BAE6FD' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', textAlign: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>MONTHLY</div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{formatCurrency(result.monthlyNetPay)}</div>
                </div>
                <div style={{ borderLeft: '1px solid #BAE6FD', borderRight: '1px solid #BAE6FD' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>ANNUAL</div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{formatCurrency(result.annualNetPay)}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TAX RATE</div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-accent)' }}>
                        {result.effectiveTaxRate.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
};
