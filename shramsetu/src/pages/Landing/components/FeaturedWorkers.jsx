// Shram Setu — Featured Workers Section (Clean White)
import { WorkerCard } from '../../../components/ui/WorkerCard';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FEATURED_WORKERS = [
  {
    profiles: { full_name: 'Ram Kumar Tamang', district: 'Kathmandu', avatar_url: null },
    worker_profiles: {
      primary_trade: 'electrician',
      average_rating: 4.8,
      total_reviews: 24,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 800,
      daily_wage_max: 1200,
    },
  },
  {
    profiles: { full_name: 'Sita Rai', district: 'Lalitpur', avatar_url: null },
    worker_profiles: {
      primary_trade: 'plumber',
      average_rating: 4.6,
      total_reviews: 18,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 900,
      daily_wage_max: 1400,
    },
  },
  {
    profiles: { full_name: 'Bikash Shrestha', district: 'Bhaktapur', avatar_url: null },
    worker_profiles: {
      primary_trade: 'mason',
      average_rating: 4.9,
      total_reviews: 31,
      verification_status: 'verified',
      availability: 'busy',
      daily_wage_min: 1000,
      daily_wage_max: 1500,
    },
  },
  {
    profiles: { full_name: 'Anita Gurung', district: 'Pokhara', avatar_url: null },
    worker_profiles: {
      primary_trade: 'painter',
      average_rating: 4.7,
      total_reviews: 15,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 700,
      daily_wage_max: 1100,
    },
  },
];

export function FeaturedWorkers() {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header">
          <h2>Featured Verified Workers</h2>
          <p>Top-rated professionals with CTEVT-verified credentials ready for hire</p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {FEATURED_WORKERS.map((worker, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: '320px',
                scrollSnapAlign: 'start',
                display: 'flex',
              }}
            >
              <WorkerCard worker={worker} onClick={() => navigate('/search/workers')} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/search/workers')}
            style={{
              background: '#FFFFFF',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
            }}
          >
            View All Skilled Workers
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
