// Shram Setu — Worker Search Page
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ShieldCheck, MapPin, SlidersHorizontal } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { WorkerCard } from '../../components/ui/WorkerCard';
import { Button } from '../../components/ui/Button';
import { TRADES, DISTRICTS } from '../../utils/constants';

const SAMPLE_WORKERS = [
  {
    id: '1',
    profiles: { full_name: 'Ram Kumar Tamang', district: 'Kathmandu', avatar_url: null },
    worker_profiles: {
      primary_trade: 'electrician',
      average_rating: 4.8,
      total_reviews: 24,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 800,
      daily_wage_max: 1200,
      years_experience: 6,
    },
  },
  {
    id: '2',
    profiles: { full_name: 'Sita Rai', district: 'Lalitpur', avatar_url: null },
    worker_profiles: {
      primary_trade: 'plumber',
      average_rating: 4.6,
      total_reviews: 18,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 900,
      daily_wage_max: 1400,
      years_experience: 4,
    },
  },
  {
    id: '3',
    profiles: { full_name: 'Bikash Shrestha', district: 'Bhaktapur', avatar_url: null },
    worker_profiles: {
      primary_trade: 'mason',
      average_rating: 4.9,
      total_reviews: 31,
      verification_status: 'verified',
      availability: 'busy',
      daily_wage_min: 1000,
      daily_wage_max: 1500,
      years_experience: 8,
    },
  },
  {
    id: '4',
    profiles: { full_name: 'Anita Gurung', district: 'Pokhara', avatar_url: null },
    worker_profiles: {
      primary_trade: 'painter',
      average_rating: 4.7,
      total_reviews: 15,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 700,
      daily_wage_max: 1100,
      years_experience: 5,
    },
  },
  {
    id: '5',
    profiles: { full_name: 'Dipendra Chaudhary', district: 'Chitwan', avatar_url: null },
    worker_profiles: {
      primary_trade: 'carpenter',
      average_rating: 4.5,
      total_reviews: 12,
      verification_status: 'unverified',
      availability: 'available',
      daily_wage_min: 850,
      daily_wage_max: 1300,
      years_experience: 3,
    },
  },
  {
    id: '6',
    profiles: { full_name: 'Sunil Thapa', district: 'Kathmandu', avatar_url: null },
    worker_profiles: {
      primary_trade: 'welder',
      average_rating: 4.9,
      total_reviews: 20,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 1100,
      daily_wage_max: 1600,
      years_experience: 7,
    },
  },
];

export function WorkerSearch() {
  const [searchParams] = useSearchParams();
  const initialTrade = searchParams.get('trade') || 'all';
  const [selectedTrade, setSelectedTrade] = useState(initialTrade);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkers = SAMPLE_WORKERS.filter((w) => {
    const wp = w.worker_profiles;
    const p = w.profiles;

    if (selectedTrade !== 'all' && wp.primary_trade !== selectedTrade) return false;
    if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;
    if (verifiedOnly && wp.verification_status !== 'verified') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.full_name.toLowerCase().includes(q);
      const matchTrade = wp.primary_trade.toLowerCase().includes(q);
      if (!matchName && !matchTrade) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              Find Skilled Workers in Nepal
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Search CTEVT-verified electricians, plumbers, masons, and tradespeople
            </p>
          </div>

          {/* Search bar & filters row */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '32px',
              background: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              alignItems: 'center',
            }}
          >
            {/* Search text input */}
            <div
              style={{
                flex: '1 1 240px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-background-subtle)',
              }}
            >
              <Search size={18} color="var(--color-text-tertiary)" />
              <input
                type="text"
                placeholder="Search by worker name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Trade filter */}
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              style={{
                flex: '0 1 180px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                background: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Trades</option>
              {TRADES.map((t) => (
                <option key={t.slug} value={t.slug}>{t.nameEn}</option>
              ))}
            </select>

            {/* District filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                flex: '0 1 180px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                background: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Locations</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Verified toggle button */}
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-full)',
                border: verifiedOnly ? '1.5px solid var(--color-secondary)' : '1.5px solid var(--color-border)',
                background: verifiedOnly ? '#D1FAE5' : '#FFFFFF',
                color: verifiedOnly ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <ShieldCheck size={16} />
              Verified Only
            </button>
          </div>

          {/* Results stats */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
              Showing {filteredWorkers.length} skilled worker{filteredWorkers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Worker grid */}
          {filteredWorkers.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 20px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <Search size={40} color="var(--color-text-tertiary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No workers found</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                Try adjusting your search criteria or removing filters to see more workers.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
