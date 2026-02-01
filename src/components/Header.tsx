import React from 'react';

export const Header: React.FC = () => {
    return (
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>Car Insurance Cost Estimator (2026)</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
                Get an instant estimate of your car insurance premium
            </p>
        </header>
    );
};
