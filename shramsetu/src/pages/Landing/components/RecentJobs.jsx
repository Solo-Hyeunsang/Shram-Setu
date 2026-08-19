// Shram Setu — Recent Jobs Section (Interactive & Responsive)
import { JobCard } from '../../../components/ui/JobCard';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RECENT_JOBS = [
  {
    id: '1',
    title: 'Residential Wiring Installation',
    trades: { slug: 'electrician', name_en: 'Electrician', icon: 'zap' },
    trade_id: 'electrician',
    description: 'Complete electrical wiring for a new 3-story residential building in Kathmandu. Must have experience with modern circuit designs.',
    district: 'Kathmandu',
    duration_days: 14,
    budget_min: 25000,
    budget_max: 40000,
    status: 'open',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'Bathroom Plumbing Repair',
    trades: { slug: 'plumber', name_en: 'Plumber', icon: 'droplets' },
    trade_id: 'plumber',
    description: 'Fix leaking pipes and install new fixtures in two bathrooms. Urgent repair needed.',
    district: 'Lalitpur',
    duration_days: 3,
    budget_min: 5000,
    budget_max: 12000,
    status: 'open',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Compound Wall Construction',
    trades: { slug: 'mason', name_en: 'Mason', icon: 'brick-wall' },
    trade_id: 'mason',
    description: 'Build a 60-meter compound wall with brick and cement. Foundation work included.',
    district: 'Bhaktapur',
    duration_days: 21,
    budget_min: 80000,
    budget_max: 120000,
    status: 'applications_received',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export function RecentJobs() {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header">
          <h2>Recent Job Postings</h2>
          <p>Explore open positions posted directly by verified employers and homeowners</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1060px',
            margin: '0 auto',
          }}
        >
          {RECENT_JOBS.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => navigate(`/search/jobs?trade=${job.trade_id || ''}`)}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Button
            variant="outline"
            onClick={() => navigate('/search/jobs')}
            style={{
              background: '#FFFFFF',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              fontWeight: '600',
            }}
          >
            Browse All Jobs
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
