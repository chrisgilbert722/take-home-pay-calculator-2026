import React, { useState } from 'react';
import type { TaxInput } from '../logic/taxCalculations';

interface ScenarioControlsProps {
    values: TaxInput;
    onChange: (field: keyof TaxInput, value: any) => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({ values, onChange }) => {
    const [showOvertime, setShowOvertime] = useState(values.overtimeHours > 0);
    const [showBonus, setShowBonus] = useState(values.bonus > 0);

    const handleToggleOvertime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setShowOvertime(checked);
        if (!checked) {
            onChange('overtimeHours', 0);
        }
    };

    const handleToggleBonus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setShowBonus(checked);
        if (!checked) {
            onChange('bonus', 0);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;
        if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        }
        onChange(name as keyof TaxInput, finalValue);
    };

    return (
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Scenarios & Adjustments</h3>

            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>

                {/* Toggles Row */}
                <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', marginBottom: 0 }}>
                        <input
                            type="checkbox"
                            checked={showOvertime}
                            onChange={handleToggleOvertime}
                            style={{ width: 'auto' }}
                        />
                        Include Overtime
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', marginBottom: 0 }}>
                        <input
                            type="checkbox"
                            checked={showBonus}
                            onChange={handleToggleBonus}
                            style={{ width: 'auto' }}
                        />
                        Include Bonus
                    </label>
                </div>

                {/* Conditional Inputs */}
                {(showOvertime || showBonus) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>

                        {showOvertime && (
                            <>
                                <div>
                                    <label htmlFor="overtimeHours">OT Hours (Per Period)</label>
                                    <input
                                        id="overtimeHours"
                                        name="overtimeHours"
                                        type="number"
                                        value={values.overtimeHours || ''}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="overtimeRate">OT Rate (Multiplier)</label>
                                    <select
                                        id="overtimeRate"
                                        name="overtimeRate"
                                        value={values.overtimeRate}
                                        onChange={handleChange}
                                    >
                                        <option value="1.5">1.5x</option>
                                        <option value="2.0">2.0x</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {showBonus && (
                            <div>
                                <label htmlFor="bonus">Annual Bonus</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                                    <input
                                        id="bonus"
                                        name="bonus"
                                        type="number"
                                        value={values.bonus || ''}
                                        onChange={handleChange}
                                        placeholder="0"
                                        style={{ paddingLeft: '28px' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
