import React from 'react';
import type { InsuranceResult } from '../logic/insuranceCalculations';

interface BreakdownTableProps {
    result: InsuranceResult;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ result }) => {
    return (
        <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem' }}>Coverage Details</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                <tbody>
                    {result.coverageDetails.map((detail, idx) => (
                        <tr key={idx} style={{
                            borderBottom: idx === result.coverageDetails.length - 1 ? 'none' : '1px solid var(--color-border)',
                            backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC'
                        }}>
                            <td style={{
                                padding: 'var(--space-3) var(--space-6)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                {detail.label}
                            </td>
                            <td style={{
                                padding: 'var(--space-3) var(--space-6)',
                                textAlign: 'right',
                                fontWeight: 600,
                                color: detail.included ? '#10B981' : '#94A3B8'
                            }}>
                                {detail.included ? 'Included' : 'Not Included'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
