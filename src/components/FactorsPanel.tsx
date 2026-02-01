import React from 'react';
import type { InsuranceResult } from '../logic/insuranceCalculations';

interface FactorsPanelProps {
    result: InsuranceResult;
}

export const FactorsPanel: React.FC<FactorsPanelProps> = ({ result }) => {
    return (
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Summary</h3>

            <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gap: 'var(--space-3)'
            }}>
                {result.coverageSummary.map((item, idx) => (
                    <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-3)',
                        fontSize: '0.9375rem',
                        color: 'var(--color-text-secondary)'
                    }}>
                        <span style={{
                            flexShrink: 0,
                            width: '6px',
                            height: '6px',
                            marginTop: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)'
                        }} />
                        {item}
                    </li>
                ))}
            </ul>

            <div style={{
                marginTop: 'var(--space-5)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5
            }}>
                <strong style={{ color: 'var(--color-text-secondary)' }}>Rating Factors:</strong> Your premium is calculated based on driver age, location, vehicle type, and selected coverage level.
            </div>
        </div>
    );
};
