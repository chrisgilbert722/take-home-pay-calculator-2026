import React from 'react';
import type { TaxInput } from '../logic/taxCalculations';

interface InputCardProps {
    values: TaxInput;
    onChange: (field: keyof TaxInput, value: any) => void;
}

const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

export const InputCard: React.FC<InputCardProps> = ({ values, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;

        if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        }

        onChange(name as keyof TaxInput, finalValue);
    };

    return (
        <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>

                {/* Salary Input */}
                <div>
                    <label htmlFor="annualSalary">Annual Salary</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                        <input
                            id="annualSalary"
                            name="annualSalary"
                            type="number"
                            value={values.annualSalary || ''}
                            onChange={handleChange}
                            placeholder="0"
                            style={{ paddingLeft: '28px', fontSize: '1.25rem', fontWeight: 600 }}
                        />
                    </div>
                </div>

                {/* Frequency & State Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="payFrequency">Pay Frequency</label>
                        <select
                            id="payFrequency"
                            name="payFrequency"
                            value={values.payFrequency}
                            onChange={handleChange}
                        >
                            <option value="weekly">Weekly (52)</option>
                            <option value="bi-weekly">Bi-Weekly (26)</option>
                            <option value="semi-monthly">Semi-Monthly (24)</option>
                            <option value="monthly">Monthly (12)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="state">State</label>
                        <select
                            id="state"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                        >
                            {STATES.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filing Status */}
                <div>
                    <label htmlFor="filingStatus">Filing Status</label>
                    <select
                        id="filingStatus"
                        name="filingStatus"
                        value={values.filingStatus}
                        onChange={handleChange}
                    >
                        <option value="single">Single</option>
                        <option value="married">Married Filing Jointly</option>
                        <option value="head">Head of Household</option>
                    </select>
                </div>

                {/* Pre-Tax Deductions */}
                <div>
                    <label htmlFor="preTaxDeductions">Pre-Tax Deductions (Annual)</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                        <input
                            id="preTaxDeductions"
                            name="preTaxDeductions"
                            type="number"
                            value={values.preTaxDeductions || ''}
                            onChange={handleChange}
                            placeholder="0"
                            style={{ paddingLeft: '28px' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Total 401(k), Medical, Dental, etc.
                    </p>
                </div>

                {/* Primary CTA - Even though it's real-time, the button reinforces action/intent */}
                <button className="btn-primary" type="button">
                    Calculate
                </button>

            </div>
        </div>
    );
};
