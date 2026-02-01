import React from 'react';

export const SEOText: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p>
                This tool provides an informational estimate of car insurance costs based on common rating
                factors such as driver age, location, vehicle type, and coverage level. The figures shown
                are estimates only and are intended for general comparison purposes. Actual insurance
                premiums vary based on driving history, credit score, specific vehicle model, and individual
                insurer underwriting criteria. For an accurate quote, contact licensed insurance providers
                in your state.
            </p>
        </div>
    );
};
