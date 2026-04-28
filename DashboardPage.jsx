import Dashboard from '../components/Dashboard';
import { useReveal } from '../hooks/useReveal';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: 24, transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#00D4FF'}
          onMouseOut={e  => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
      <Dashboard />
    </div>
  );
}
