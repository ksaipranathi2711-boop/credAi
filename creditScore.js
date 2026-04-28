/**
 * computeCreditScore
 * Modular credit scoring engine — drop-in replacement for ML API response.
 * All weights and band thresholds are isolated for easy ML integration.
 */

// ── Scoring weights (swap out for ML model coefficients) ──────────────────
const WEIGHTS = {
  savings:      180,   // max pts from income/expense ratio
  paymentHist:  150,   // max pts from payment history
  transactions:  80,   // max pts from transaction volume
  behavioral:    80,   // max pts from behavioral/mobile score
  utilization:   60,   // max pts from credit utilization
};

const BASE_SCORE = 300;
const MAX_SCORE  = 850;

// ── Risk bands ───────────────────────────────────────────────────────────
const RISK_BANDS = [
  { min: 750, max: 850, band: 'EXCELLENT',      detail: 'Prime rates apply. Outstanding financial health.',           color: '#00D4FF', defaultProb: 0.01 },
  { min: 700, max: 749, band: 'LOW RISK',        detail: 'Strong profile. Most loans approved easily.',               color: '#06b6d4', defaultProb: 0.03 },
  { min: 650, max: 699, band: 'MODERATE',        detail: 'Good standing. Slightly higher rates possible.',            color: '#a78bfa', defaultProb: 0.06 },
  { min: 580, max: 649, band: 'MEDIUM RISK',     detail: 'Fair. Consider reducing utilization.',                      color: '#f59e0b', defaultProb: 0.10 },
  { min: 500, max: 579, band: 'HIGH RISK',       detail: 'Below average. Focus on payment consistency.',              color: '#f97316', defaultProb: 0.16 },
  { min: 300, max: 499, band: 'VERY HIGH RISK',  detail: 'Needs significant improvement.',                            color: '#ef4444', defaultProb: 0.25 },
];

// ── Loan eligibility tiers ────────────────────────────────────────────────
function computeLoanEligibility(score, annualIncome) {
  if (score >= 750) return { eligible: true, maxAmount: Math.min(annualIncome * 5,   500000), rateMin: 4.5,  rateMax: 7.5,  tier: 'prime' };
  if (score >= 700) return { eligible: true, maxAmount: Math.min(annualIncome * 3.5, 300000), rateMin: 7.5,  rateMax: 11,   tier: 'standard' };
  if (score >= 650) return { eligible: true, maxAmount: Math.min(annualIncome * 2,   150000), rateMin: 11,   rateMax: 16,   tier: 'standard' };
  if (score >= 580) return { eligible: true, maxAmount: Math.min(annualIncome,        75000), rateMin: 16,   rateMax: 22,   tier: 'subprime' };
  if (score >= 500) return { eligible: true, maxAmount: Math.min(annualIncome * 0.5,  25000), rateMin: 22,   rateMax: 28,   tier: 'subprime' };
  return { eligible: false, maxAmount: 0, rateMin: 0, rateMax: 0, tier: 'declined' };
}

// ── Factor explainability ─────────────────────────────────────────────────
function buildFactors(pts, inputs) {
  const { savingsRatio, payHist, transactions, behavioral, utilization } = inputs;
  return [
    {
      name:         'Income & Savings',
      icon:         'trending-up',
      contribution: pts.savings,
      maxPossible:  WEIGHTS.savings,
      tip:          savingsRatio >= 0.45
        ? 'Excellent savings discipline!'
        : savingsRatio >= 0.25
          ? 'Good savings. Target 45%+ ratio.'
          : 'Reduce expenses to improve savings ratio.',
      color: savingsRatio >= 0.45 ? 'green' : savingsRatio >= 0.25 ? 'amber' : 'red',
    },
    {
      name:         'Payment History',
      icon:         'calendar-check',
      contribution: pts.paymentHist,
      maxPossible:  WEIGHTS.paymentHist,
      tip:          payHist >= 90
        ? 'Perfect payment record!'
        : payHist >= 65
          ? 'Mostly on-time. Automate bills.'
          : 'Late payments hurt score. Prioritize timely payments.',
      color: payHist >= 90 ? 'green' : payHist >= 65 ? 'amber' : 'red',
    },
    {
      name:         'Transaction Activity',
      icon:         'repeat',
      contribution: pts.transactions,
      maxPossible:  WEIGHTS.transactions,
      tip:          transactions >= 60
        ? 'High activity — great behavioral signal.'
        : transactions >= 30
          ? 'Moderate activity.'
          : 'Increase regular activity to build history.',
      color: transactions >= 60 ? 'green' : transactions >= 30 ? 'amber' : 'red',
    },
    {
      name:         'Behavioral Score',
      icon:         'smartphone',
      contribution: pts.behavioral,
      maxPossible:  WEIGHTS.behavioral,
      tip:          behavioral >= 70
        ? 'Strong digital footprint!'
        : behavioral >= 40
          ? 'Moderate engagement.'
          : 'Low digital usage.',
      color: behavioral >= 70 ? 'green' : behavioral >= 40 ? 'amber' : 'red',
    },
    {
      name:         'Credit Utilization',
      icon:         'pie-chart',
      contribution: pts.utilization,
      maxPossible:  WEIGHTS.utilization,
      tip:          utilization <= 20
        ? 'Excellent — below 20% is ideal!'
        : utilization <= 40
          ? 'Acceptable — aim for <30%.'
          : 'High utilization hurts score. Pay down balances.',
      color: utilization <= 20 ? 'green' : utilization <= 40 ? 'amber' : 'red',
    },
  ];
}

// ── Suggestion engine ─────────────────────────────────────────────────────
function buildSuggestions(score, inputs, expenses, income) {
  const { savingsRatio, payHist, transactions, behavioral, utilization } = inputs;
  const sugg = [];
  if (savingsRatio < 0.30)  sugg.push(`💰 Reduce monthly expenses by ~$${Math.round(expenses - income * 0.70).toLocaleString()} to hit a 30% savings ratio`);
  if (payHist < 75)         sugg.push('📅 Set up auto-pay — on-time payments contribute up to 150 pts');
  if (utilization > 30)     sugg.push(`💳 Lower credit utilization from ${utilization}% to below 30%`);
  if (transactions < 40)    sugg.push('🔁 Increase monthly transactions to 40+ for better behavioral scoring');
  if (behavioral < 60)      sugg.push('📱 Higher digital engagement improves alternative data scoring');
  if (score >= 700)         sugg.push('🏆 Your profile qualifies for premium credit products!');
  return sugg.slice(0, 5);
}

// ── Main export ───────────────────────────────────────────────────────────
/**
 * computeCreditScore(data)
 *
 * @param {object} data
 * @param {number} data.income           - Monthly income ($)
 * @param {number} data.expenses         - Monthly expenses ($)
 * @param {number} data.transactions     - Monthly transaction count
 * @param {number} data.behavioral       - Behavioral/mobile score (1-100)
 * @param {number} data.paymentHistory   - Payment history (0-100%)
 * @param {number} data.creditUtilization - Credit utilization (0-100%)
 * @param {number|null} data.previousScore - Previous score for delta
 * @returns {object} Full scoring result
 */
export function computeCreditScore({
  income,
  expenses,
  transactions,
  behavioral,
  paymentHistory,
  creditUtilization,
  previousScore = null,
}) {
  // ── Normalised inputs ────────────────────────────────────────
  const savingsRatio   = income > 0 ? Math.max(0, (income - expenses) / income) : 0;
  const utilization    = Math.max(0, Math.min(100, creditUtilization));
  const payHist        = Math.max(0, Math.min(100, paymentHistory));

  // ── Point components ─────────────────────────────────────────
  const pts = {
    savings:      Math.round(savingsRatio * WEIGHTS.savings),
    paymentHist:  Math.round((payHist / 100) * WEIGHTS.paymentHist),
    transactions: Math.round(Math.min(transactions, 100) * 0.8),
    behavioral:   Math.round((behavioral / 100) * WEIGHTS.behavioral),
    utilization:  Math.round(Math.max(0, (100 - utilization) / 100) * WEIGHTS.utilization),
  };

  // ── Raw score ────────────────────────────────────────────────
  const rawScore = BASE_SCORE + Object.values(pts).reduce((a, b) => a + b, 0);
  const score    = Math.max(BASE_SCORE, Math.min(MAX_SCORE, rawScore));

  // ── Risk band ────────────────────────────────────────────────
  const riskBand = RISK_BANDS.find(b => score >= b.min && score <= b.max) || RISK_BANDS[RISK_BANDS.length - 1];

  // ── Percentile (approximate) ──────────────────────────────────
  const percentileRank = Math.round(((score - BASE_SCORE) / (MAX_SCORE - BASE_SCORE)) * 85 + 5);

  // ── Delta ────────────────────────────────────────────────────
  const delta = previousScore !== null ? score - previousScore : null;

  // ── Loan eligibility ─────────────────────────────────────────
  const annualIncome = income * 12;
  const loan = computeLoanEligibility(score, annualIncome);

  // ── Factors & suggestions ─────────────────────────────────────
  const inputsObj = { savingsRatio, payHist, transactions, behavioral, utilization };
  const factors    = buildFactors(pts, inputsObj);
  const suggestions = buildSuggestions(score, inputsObj, expenses, income);

  return {
    score,
    band:               riskBand.band,
    detail:             riskBand.detail,
    color:              riskBand.color,
    defaultProbability: (riskBand.defaultProb * 100).toFixed(1),
    percentile:         `Top ${100 - percentileRank}%`,
    delta,
    factors,
    suggestions,
    loan,
    // Raw breakdown (useful for ML debugging)
    _breakdown: { ...pts, savingsRatio: (savingsRatio * 100).toFixed(1) },
  };
}
