import { useState } from 'react';
import { Header } from './components/Header';
import { InputCard } from './components/InputCard';
import { ResultsPanel } from './components/ResultsPanel';
import { ScenarioControls } from './components/ScenarioControls';
import { AdContainer } from './components/AdContainer';
import { BreakdownTable } from './components/BreakdownTable';
import { SEOText } from './components/SEOText';
import { Footer } from './components/Footer';
import { calculateTakeHome } from './logic/taxCalculations';
import type { TaxInput } from './logic/taxCalculations';

function App() {
  // Initialize state with sensible defaults
  const [values, setValues] = useState<TaxInput>({
    annualSalary: 75000,
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    state: 'CA',
    preTaxDeductions: 0,
    overtimeHours: 0,
    overtimeRate: 1.5,
    bonus: 0
  });

  const handleChange = (field: keyof TaxInput, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  // Pure, Synchronous Calculation (Computed on every render)
  const result = calculateTakeHome(values);

  return (
    <>
      <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

        {/* 1) ABOVE-THE-FOLD HEADER */}
        <Header />

        {/* 2) PRIMARY INPUT CARD */}
        <InputCard values={values} onChange={handleChange} />

        {/* 3) RESULTS PANEL */}
        <ResultsPanel result={result} />

        {/* 4) SCENARIO / ADJUSTMENT CONTROLS */}
        <ScenarioControls values={values} onChange={handleChange} />

        {/* 5) FIRST ADSENSE PLACEMENT (NATIVE) */}
        {/* Placed strictly AFTER results and controls */}
        <AdContainer slotId="native-slot-placeholder" sticky={false} />

        {/* 6) PAYCHECK BREAKDOWN SECTION */}
        <BreakdownTable result={result} />

        {/* 7) SHORT EXPLANATION (SEO) */}
        <SEOText />

        {/* 9) TRUST & COMPLIANCE (Placed before Footer Ad logic in DOM, but visually below) */}
        {/* Note: User requested FooterAd then TRUST footer, but FooterAd is sticky bottom.
            The list order in DOM: Header -> Inputs -> Results -> Controls -> Ad -> Table -> SEO -> Footer -> StickyAd
            The StickyAd overlays the bottom. */
        }
        <Footer />

        {/* 8) SECOND ADSENSE PLACEMENT (STICKY FOOTER) */}
        <AdContainer slotId="sticky-footer-placeholder" sticky={true} />

      </main>
    </>
  );
}

export default App;
