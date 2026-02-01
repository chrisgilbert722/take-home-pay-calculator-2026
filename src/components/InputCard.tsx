import React from 'react';
import type { InsuranceInput } from '../logic/insuranceCalculations';

interface InputCardProps {
    values: InsuranceInput;
    onChange: (field: keyof InsuranceInput, value: any) => void;
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
            finalValue = parseInt(value) || 0;
        }
        onChange(name as keyof InsuranceInput, finalValue);
    };

    return (
        <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>

                {/* Driver Age & State Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                        <label htmlFor="driverAge">Driver Age</label>
                        <input
                            id="driverAge"
                            name="driverAge"
                            type="number"
                            min="16"
                            max="99"
                            value={values.driverAge || ''}
                            onChange={handleChange}
                            placeholder="35"
                        />
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

                {/* Vehicle Type */}
                <div>
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select
                        id="vehicleType"
                        name="vehicleType"
                        value={values.vehicleType}
                        onChange={handleChange}
                    >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="truck">Truck</option>
                        <option value="sports">Sports Car</option>
                        <option value="luxury">Luxury Vehicle</option>
                        <option value="electric">Electric Vehicle</option>
                    </select>
                </div>

                {/* Coverage Level */}
                <div>
                    <label htmlFor="coverageLevel">Coverage Level</label>
                    <select
                        id="coverageLevel"
                        name="coverageLevel"
                        value={values.coverageLevel}
                        onChange={handleChange}
                    >
                        <option value="minimum">Minimum (Liability Only)</option>
                        <option value="standard">Standard (Liability + Collision)</option>
                        <option value="full">Full (Comprehensive)</option>
                    </select>
                </div>

                {/* Primary CTA */}
                <button className="btn-primary" type="button">
                    Get Estimate
                </button>

            </div>
        </div>
    );
};
