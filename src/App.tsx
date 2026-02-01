import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CarInsurance from './pages/CarInsurance';
import HomeownersInsurance from './pages/HomeownersInsurance';
import RentersInsurance from './pages/RentersInsurance';

function HomePage() {
  return (
    <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Insurance Cost Estimators (2026)</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          Choose a calculator to estimate your insurance costs
        </p>
      </header>

      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Link to="/car-insurance-cost-estimator" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Car Insurance Cost Estimator</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Estimate your auto insurance premium based on driver age, location, vehicle type, and coverage level.
          </p>
        </Link>

        <Link to="/homeowners-insurance-cost-estimator" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Homeowners Insurance Cost Estimator</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Estimate your homeowners insurance premium based on home value, location, property type, and coverage level.
          </p>
        </Link>

        <Link to="/renters-insurance-cost-estimator" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Renters Insurance Cost Estimator</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
            Estimate your renters insurance premium based on personal property value, location, unit type, and coverage level.
          </p>
        </Link>
      </div>

      <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
          <li>• Estimates only</li>
          <li>• Actual premiums vary</li>
          <li>• No account required</li>
          <li>• Free to use</li>
        </ul>
        <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>
          &copy; 2026 Insurance Cost Estimators. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/car-insurance-cost-estimator" element={<CarInsurance />} />
        <Route path="/homeowners-insurance-cost-estimator" element={<HomeownersInsurance />} />
        <Route path="/renters-insurance-cost-estimator" element={<RentersInsurance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
