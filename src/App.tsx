import { useState } from 'react';

interface PayInput {
  grossPay: number;
  payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' | 'annual';
  filingStatus: 'single' | 'married' | 'head-of-household';
  state: string;
  allowances: number;
  preTax401k: number;
  preTaxHealth: number;
}

const STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"];

const NO_STATE_TAX = ["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"];

const STATE_TAX_RATES: Record<string, number> = {
  'CA': 0.0725, 'NY': 0.0685, 'NJ': 0.0637, 'OR': 0.0875, 'MN': 0.0785,
  'MA': 0.05, 'IL': 0.0495, 'PA': 0.0307, 'OH': 0.04, 'MI': 0.0425,
  'default': 0.045
};

const PAY_PERIODS: Record<string, number> = {
  'weekly': 52, 'bi-weekly': 26, 'semi-monthly': 24, 'monthly': 12, 'annual': 1
};

function calculateTakeHome(input: PayInput) {
  const periods = PAY_PERIODS[input.payFrequency];
  const annualGross = input.grossPay * periods;
  const preTaxDeductions = (input.preTax401k + input.preTaxHealth) * periods;
  const taxableIncome = annualGross - preTaxDeductions;

  // Federal tax (simplified 2026 brackets for single)
  let federalTax = 0;
  const brackets = input.filingStatus === 'single'
    ? [{ limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 }, { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 }, { limit: Infinity, rate: 0.37 }]
    : input.filingStatus === 'married'
    ? [{ limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 }, { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 }, { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 }, { limit: Infinity, rate: 0.37 }]
    : [{ limit: 16550, rate: 0.10 }, { limit: 63100, rate: 0.12 }, { limit: 100500, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 }, { limit: Infinity, rate: 0.37 }];

  let remaining = taxableIncome - (input.allowances * 4300);
  let prevLimit = 0;
  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, bracket.limit - prevLimit);
    federalTax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.limit;
  }

  // Social Security (6.2% up to $168,600 in 2026)
  const socialSecurity = Math.min(annualGross, 168600) * 0.062;

  // Medicare (1.45% + 0.9% additional over $200k)
  const medicare = annualGross * 0.0145 + Math.max(0, annualGross - 200000) * 0.009;

  // State tax
  let stateTax = 0;
  if (!NO_STATE_TAX.includes(input.state)) {
    const rate = STATE_TAX_RATES[input.state] || STATE_TAX_RATES['default'];
    stateTax = taxableIncome * rate;
  }

  const totalTaxes = federalTax + socialSecurity + medicare + stateTax;
  const annualNet = annualGross - totalTaxes - preTaxDeductions;
  const periodNet = annualNet / periods;

  return {
    gross: input.grossPay,
    federal: federalTax / periods,
    socialSecurity: socialSecurity / periods,
    medicare: medicare / periods,
    state: stateTax / periods,
    preTax401k: input.preTax401k,
    preTaxHealth: input.preTaxHealth,
    net: periodNet,
    annualGross,
    annualNet
  };
}

const formatCurrency = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function App() {
  const [values, setValues] = useState<PayInput>({
    grossPay: 5000,
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    state: 'CA',
    allowances: 1,
    preTax401k: 250,
    preTaxHealth: 100
  });

  const handleChange = (field: keyof PayInput, value: string | number) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const result = calculateTakeHome(values);

  return (
    <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Take Home Pay Calculator (2026)</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Calculate your net pay after taxes and deductions</p>
      </header>

      <div className="card">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label htmlFor="grossPay">Gross Pay ($)</label>
              <input type="number" id="grossPay" value={values.grossPay} onChange={(e) => handleChange('grossPay', Number(e.target.value))} min="0" step="100" />
            </div>
            <div>
              <label htmlFor="payFrequency">Pay Frequency</label>
              <select id="payFrequency" value={values.payFrequency} onChange={(e) => handleChange('payFrequency', e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="semi-monthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label htmlFor="filingStatus">Filing Status</label>
              <select id="filingStatus" value={values.filingStatus} onChange={(e) => handleChange('filingStatus', e.target.value)}>
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head-of-household">Head of Household</option>
              </select>
            </div>
            <div>
              <label htmlFor="state">State</label>
              <select id="state" value={values.state} onChange={(e) => handleChange('state', e.target.value)}>
                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label htmlFor="allowances">Allowances</label>
              <input type="number" id="allowances" value={values.allowances} onChange={(e) => handleChange('allowances', Number(e.target.value))} min="0" max="10" />
            </div>
            <div>
              <label htmlFor="preTax401k">401(k) ($)</label>
              <input type="number" id="preTax401k" value={values.preTax401k} onChange={(e) => handleChange('preTax401k', Number(e.target.value))} min="0" step="50" />
            </div>
            <div>
              <label htmlFor="preTaxHealth">Health Ins ($)</label>
              <input type="number" id="preTaxHealth" value={values.preTaxHealth} onChange={(e) => handleChange('preTaxHealth', Number(e.target.value))} min="0" step="25" />
            </div>
          </div>

          <button className="btn-primary" type="button">Calculate</button>
        </div>
      </div>

      <div className="card results-panel">
        <div className="text-center">
          <p className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Your Take Home Pay</p>
          <p className="result-hero">{formatCurrency(result.net)}</p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>per {values.payFrequency === 'bi-weekly' ? 'paycheck' : values.payFrequency === 'annual' ? 'year' : values.payFrequency.replace('-', ' ')}</p>
        </div>
        <hr className="result-divider" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="text-center">
            <p className="result-label">Annual Gross</p>
            <p className="result-value">{formatCurrency(result.annualGross)}</p>
          </div>
          <div className="text-center">
            <p className="result-label">Annual Net</p>
            <p className="result-value">{formatCurrency(result.annualNet)}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1rem' }}>Pay Breakdown</h3>
        </div>
        <table className="breakdown-table">
          <tbody>
            <tr>
              <td>Gross Pay</td>
              <td className="text-right">{formatCurrency(result.gross)}</td>
            </tr>
            <tr>
              <td className="breakdown-deduction">Federal Tax</td>
              <td className="text-right breakdown-deduction">-{formatCurrency(result.federal)}</td>
            </tr>
            <tr>
              <td className="breakdown-deduction">Social Security</td>
              <td className="text-right breakdown-deduction">-{formatCurrency(result.socialSecurity)}</td>
            </tr>
            <tr>
              <td className="breakdown-deduction">Medicare</td>
              <td className="text-right breakdown-deduction">-{formatCurrency(result.medicare)}</td>
            </tr>
            {result.state > 0 && (
              <tr>
                <td className="breakdown-deduction">State Tax ({values.state})</td>
                <td className="text-right breakdown-deduction">-{formatCurrency(result.state)}</td>
              </tr>
            )}
            {result.preTax401k > 0 && (
              <tr>
                <td className="breakdown-deduction">401(k) Contribution</td>
                <td className="text-right breakdown-deduction">-{formatCurrency(result.preTax401k)}</td>
              </tr>
            )}
            {result.preTaxHealth > 0 && (
              <tr>
                <td className="breakdown-deduction">Health Insurance</td>
                <td className="text-right breakdown-deduction">-{formatCurrency(result.preTaxHealth)}</td>
              </tr>
            )}
            <tr className="breakdown-row-total">
              <td className="breakdown-net">Take Home Pay</td>
              <td className="text-right breakdown-net">{formatCurrency(result.net)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ad-container"><span>Advertisement</span></div>

      <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        <p>This calculator provides estimates based on 2026 federal tax brackets and general state tax rates. Actual take-home pay may vary based on local taxes, additional deductions, and individual circumstances. Consult a tax professional for personalized advice.</p>
      </div>

      <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
          <li>Estimates only</li><li>•</li><li>2026 tax brackets</li><li>•</li><li>Consult a tax professional</li>
        </ul>
        <nav style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <a href="https://scenariocalculators.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Privacy Policy</a>
          <span style={{ color: '#64748B' }}>|</span>
          <a href="https://scenariocalculators.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Terms of Service</a>
        </nav>
        <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Take Home Pay Calculator</p>
      </footer>

      <div className="ad-container ad-sticky"><span>Advertisement</span></div>
    </main>
  );
}

export default App;
