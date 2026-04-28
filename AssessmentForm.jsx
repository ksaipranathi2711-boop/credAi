import { useState, useEffect, useCallback } from 'react';
import { Cpu, RefreshCw, CheckCircle } from 'lucide-react';
import { computeCreditScore } from '../utils/creditScore';
import { apiPredict } from '../utils/api';
import { saveLocalHistory } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ScoreResult from './ScoreResult';

const DEFAULT_FORM = {
  income:           4500,
  expenses:         2100,
  transactions:     45,
  creditUtil:       30,
  paymentHistory:   100,
  behavioral:       80,
};

export default function AssessmentForm() {
  const { user, refreshHistory } = useAuth();
  const toast = useToast();

  const [form, setForm]           = useState(DEFAULT_FORM);
  const [liveScore, setLiveScore] = useState(785);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [btnState, setBtnState]   = useState('idle'); // idle | loading | done
  const [lastScore, setLastScore] = useState(null);

  // ── Live preview on any form change ───────────────────────
  useEffect(() => {
    const preview = computeCreditScore({
      income:           form.income,
      expenses:         form.expenses,
      transactions:     form.transactions,
      behavioral:       form.behavioral,
      paymentHistory:   form.paymentHistory,
      creditUtilization: form.creditUtil,
    });
    setLiveScore(preview.score);
  }, [form]);

  const handleChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }, []);

  // ── Run full calculation ───────────────────────────────────
  const runCalculation = async () => {
    if (loading) return;

    if (form.expenses > form.income * 1.5) {
      toast('Expenses seem unusually high. Please check your inputs.', 'warning');
    }

    setLoading(true);
    setBtnState('loading');

    let calcResult;
    try {
      const session  = user;
      const payload  = {
        income:          form.income,
        expenses:        form.expenses,
        transactions:    form.transactions,
        mobileUsage:     form.behavioral,
        paymentHistory:  form.paymentHistory,
        creditUtil:      form.creditUtil,
        previousScore:   lastScore,
      };
      const res = await Promise.race([
        apiPredict(payload, session?.token),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
      ]);
      calcResult = res;
    } catch {
      calcResult = computeCreditScore({
        income:            form.income,
        expenses:          form.expenses,
        transactions:      form.transactions,
        behavioral:        form.behavioral,
        paymentHistory:    form.paymentHistory,
        creditUtilization: form.creditUtil,
        previousScore:     lastScore,
      });
    }

    // Simulate slight AI analysis delay
    await new Promise(r => setTimeout(r, 600));

    setResult(calcResult);
    setLastScore(calcResult.score);
    setLoading(false);
    setBtnState('done');

    // Persist history
    if (user) {
      const entry = {
        score:        calcResult.score,
        band:         calcResult.band,
        income:       form.income,
        expenses:     form.expenses,
        transactions: form.transactions,
        mobileUsage:  form.behavioral,
        creditUtil:   form.creditUtil,
        date:         new Date().toISOString(),
      };
      saveLocalHistory(user.email, entry);
      refreshHistory(user.email);

      if (calcResult.delta !== null) {
        if (calcResult.delta > 0) toast(`🎉 Score up ${calcResult.delta} pts! Great improvement.`, 'success');
        else if (calcResult.delta < 0) toast(`⚠️ Score dropped by ${Math.abs(calcResult.delta)} pts.`, 'warning');
      }
      if (calcResult.loan?.eligible && calcResult.score >= 700) {
        toast('🏦 You qualify for prime loan rates!', 'success');
      }
    } else {
      toast('Sign in to save your score history!', 'info');
    }

    // Reset button after 3.5s
    setTimeout(() => setBtnState('idle'), 3500);

    // Scroll result into view
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const liveBarWidth = ((liveScore - 300) / 550 * 100).toFixed(1) + '%';

  return (
    <section id="assessment" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }} className="reveal">
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.07)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#8B5CF6', marginBottom: 14, fontFamily: 'Syne, sans-serif' }}>
            CREDIT ASSESSMENT
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Calculate Your Score</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Input your financial signals. Our AI engine calculates your score with full explainability.
          </p>
        </div>

        {/* Form card */}
        <div className="glass-strong reveal" style={{ borderRadius: 28, padding: 40, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%,rgba(0,212,255,0.04),transparent 60%)', pointerEvents: 'none' }} />

          {/* Fields grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, marginBottom: 24 }}>

            <div>
              <label className="field-label">Monthly Income ($)</label>
              <input type="number" className="field-input" value={form.income} min="0"
                onChange={e => handleChange('income', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Monthly Expenses ($)</label>
              <input type="number" className="field-input" value={form.expenses} min="0"
                onChange={e => handleChange('expenses', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Monthly Transactions</label>
              <input type="number" className="field-input" value={form.transactions} min="0"
                onChange={e => handleChange('transactions', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Credit Utilization (%)</label>
              <input type="number" className="field-input" value={form.creditUtil} min="0" max="100"
                onChange={e => handleChange('creditUtil', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Payment History</label>
              <select className="field-input" value={form.paymentHistory}
                onChange={e => handleChange('paymentHistory', e.target.value)}>
                <option value="100">Excellent — Always on time</option>
                <option value="75">Good — Rarely late</option>
                <option value="50">Fair — Sometimes late</option>
                <option value="25">Poor — Often late</option>
              </select>
            </div>

            <div>
              <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Behavioral Score</span>
                <span style={{ color: '#00D4FF', fontWeight: 700 }}>{form.behavioral}</span>
              </label>
              <input
                type="range" min="1" max="100" value={form.behavioral}
                style={{ width: '100%', accentColor: '#00D4FF', marginTop: 20 }}
                onChange={e => handleChange('behavioral', e.target.value)}
              />
            </div>
          </div>

          {/* Live preview bar */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Live Score Preview</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#00D4FF' }}>{liveScore}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: liveBarWidth,
                borderRadius: 99,
                background: 'linear-gradient(90deg,#ff2050,#f59e0b,#2DD4BF,#00D4FF)',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>300</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>850</span>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={runCalculation}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: '1rem', borderRadius: 16 }}
          >
            {btnState === 'loading' && <><span className="loader" /><span>Analyzing…</span></>}
            {btnState === 'done'    && <><CheckCircle size={18} /><span>Score Calculated!</span></>}
            {btnState === 'idle'    && (
              result
                ? <><RefreshCw size={18} /><span>Recalculate</span></>
                : <><Cpu size={18} /><span>Calculate Credit Score</span></>
            )}
          </button>
        </div>

        {/* Result */}
        <div id="result-section">
          {result && <ScoreResult result={result} income={form.income} expenses={form.expenses} />}
        </div>
      </div>
    </section>
  );
}
