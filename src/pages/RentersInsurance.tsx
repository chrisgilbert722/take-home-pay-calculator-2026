import { useState } from 'react';
import { AdContainer } from '../components/AdContainer';
import { calculateRentersInsurance } from '../logic/rentersInsurance';
import type { RentersInput } from '../logic/rentersInsurance';

const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);
};

export default function RentersInsurance() {
    const [values, setValues] = useState<RentersInput>({
        personalPropertyValue: 25000,
        state: 'CA',
        unitType: 'apartment',
        coverageLevel: 'standard'
    });

    const handleChange = (field: keyof RentersInput, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));
    };

    const result = calculateRentersInsurance(values);

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* HEADER */}
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Renters Insurance Cost Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                    Get an instant estimate of your renters insurance premium
                </p>
            </header>

            {/* INPUT CARD */}
            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="personalPropertyValue">Personal Property Value</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                            <input
                                id="personalPropertyValue"
                                type="number"
                                min="5000"
                                step="1000"
                                value={values.personalPropertyValue || ''}
                                onChange={(e) => handleChange('personalPropertyValue', parseInt(e.target.value) || 0)}
                                placeholder="25000"
                                style={{ paddingLeft: '28px', fontSize: '1.25rem', fontWeight: 600 }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            Estimated value of your belongings
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label htmlFor="state">State</label>
                            <select
                                id="state"
                                value={values.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                            >
                                {STATES.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="unitType">Unit Type</label>
                            <select
                                id="unitType"
                                value={values.unitType}
                                onChange={(e) => handleChange('unitType', e.target.value)}
                            >
                                <option value="apartment">Apartment</option>
                                <option value="house">Rental House</option>
                                <option value="condo">Condo</option>
                                <option value="room">Room/Shared</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="coverageLevel">Coverage Level</label>
                        <select
                            id="coverageLevel"
                            value={values.coverageLevel}
                            onChange={(e) => handleChange('coverageLevel', e.target.value)}
                        >
                            <option value="basic">Basic (Essential Coverage)</option>
                            <option value="standard">Standard (Recommended)</option>
                            <option value="premium">Premium (Maximum Protection)</option>
                        </select>
                    </div>
                    <button className="btn-primary" type="button">Get Estimate</button>
                </div>
            </div>

            {/* RESULTS PANEL */}
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

            {/* COVERAGE SUMMARY */}
            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Coverage Level Summary</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {result.coverageSummary.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ flexShrink: 0, width: '6px', height: '6px', marginTop: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* AD */}
            <AdContainer slotId="native-slot-placeholder" sticky={false} />

            {/* COVERAGE DETAILS */}
            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Coverage Details</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <tbody>
                        {result.coverageDetails.map((detail, idx) => (
                            <tr key={idx} style={{ borderBottom: idx === result.coverageDetails.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{detail.label}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 600, color: detail.included ? '#10B981' : '#94A3B8' }}>
                                    {detail.included ? 'Included' : 'Not Included'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SEO TEXT */}
            <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>
                    This tool provides an informational estimate of renters insurance costs based on common rating
                    factors such as personal property value, location, unit type, and coverage level. The figures shown
                    are estimates only and are intended for general comparison purposes. Actual insurance
                    premiums vary based on building type, claims history, credit score, and individual
                    insurer underwriting criteria. For an accurate quote, contact licensed insurance providers
                    in your state.
                </p>
            </div>

            {/* FOOTER */}
            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li>
                    <li>• Actual premiums vary</li>
                    <li>• No account required</li>
                    <li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>
                    &copy; 2026 Renters Insurance Cost Estimator. All rights reserved.
                </p>
            </footer>

            {/* STICKY AD */}
            <AdContainer slotId="sticky-footer-placeholder" sticky={true} />
        </main>
    );
}
