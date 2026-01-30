import React from 'react';

export const Header: React.FC = () => {
    return (
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Take-Home Pay Calculator (2026)</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                Estimate your real paycheck after taxes in seconds
            </p>
        </header>
    );
};
