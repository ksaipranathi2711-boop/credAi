import { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import { BarChart2 } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TOOLTIP_OPTS = {
  backgroundColor: 'rgba(4,6,15,0.95)',
  titleColor: '#00D4FF',
  bodyColor: '#fff',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
};

export default function AnalyticsCharts({ income, expenses }) {
  const savings = Math.max(0, income - expenses);
  const housing = Math.max(0, expenses * 0.4);
  const food    = Math.max(0, expenses * 0.2);
  const other   = Math.max(0, expenses * 0.3);
  const misc    = Math.max(0, expenses * 0.1);

  const pieData = useMemo(() => ({
    labels: ['Housing', 'Food', 'Other', 'Misc', 'Savings'],
    datasets: [{
      data: [housing, food, other, misc, savings],
      backgroundColor: ['#8B5CF6', '#00D4FF', '#f59e0b', '#f97316', '#2DD4BF'],
      borderColor: 'transparent',
      borderWidth: 0,
    }],
  }), [housing, food, other, misc, savings]);

  const barData = useMemo(() => ({
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [{
      data: [income, expenses, savings],
      backgroundColor: ['rgba(0,212,255,0.7)', 'rgba(255,32,80,0.6)', 'rgba(45,212,191,0.7)'],
      borderColor:     ['#00D4FF', '#ff2050', '#2DD4BF'],
      borderWidth: 1,
      borderRadius: 6,
    }],
  }), [income, expenses, savings]);

  const pieOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10, family: 'DM Sans' }, boxWidth: 10, padding: 8 },
      },
      tooltip: TOOLTIP_OPTS,
    },
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: TOOLTIP_OPTS },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: 'rgba(255,255,255,0.35)', font: { size: 11 },
          callback: (v) => '$' + Number(v).toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="glass-strong" style={{ borderRadius: 24, padding: 28, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart2 size={16} color="#8B5CF6" />
        </div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700 }}>Financial Analytics</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
            SPENDING BREAKDOWN
          </p>
          <div style={{ height: 200, position: 'relative' }}>
            <Doughnut data={pieData} options={pieOpts} />
          </div>
        </div>
        <div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 10, fontFamily: 'Syne, sans-serif', letterSpacing: '0.08em' }}>
            INCOME VS EXPENSES
          </p>
          <div style={{ height: 200, position: 'relative' }}>
            <Bar data={barData} options={barOpts} />
          </div>
        </div>
      </div>
    </div>
  );
}
