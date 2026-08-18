// Shram Setu — Job Search Page
import { useState } from 'react';
import { Search, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { JobCard } from '../../components/ui/JobCard';
import { Button } from '../../components/ui/Button';
import { TRADES, DISTRICTS } from '../../utils/constants';

const SAMPLE_JOBS = [
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
    title: 'Bathroom Plumbing Repair & Fitting',
    trades: { slug: 'plumber', name_en: 'Plumber', icon: 'droplets' },
    trade_id: 'plumber',
    description: 'Fix leaking pipes and install new sanitary fixtures in two bathrooms. Urgent repair needed.',
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
    description: 'Build a 60-meter compound wall with brick and cement mortar. Foundation work included.',
    district: 'Bhaktapur',
    duration_days: 21,
    budget_min: 80000,
    budget_max: 120000,
    status: 'applications_received',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '4',
    title: 'Villa Interior Painting',
    trades: { slug: 'painter', name_en: 'Painter', icon: 'paintbrush' },
    trade_id: 'painter',
    description: 'Interior wall putty and premium acrylic emulsion painting for 4 bedrooms and a living hall.',
    district: 'Kathmandu',
    duration_days: 7,
    budget_min: 20000,
    budget_max: 35000,
    status: 'open',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export function JobSearch() {
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const filteredJobs = SAMPLE_JOBS.filter((j) => {
    if (selectedTrade !== 'all' && j.trade_id !== selectedTrade) return false;
    if (selectedDistrict !== 'all' && j.district !== selectedDistrict) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchDesc = j.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const handleApply = (e) => {
    e.preventDefault();
    if (selectedJob) {
      setAppliedJobs(new Set([...appliedJobs, selectedJob.id]));
      setSelectedJob(null);
      setApplyMessage('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              Browse Job Opportunities
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Apply directly to open jobs posted by homeowners and business contractors
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
                placeholder="Search job title or keywords..."
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
          </div>

          {/* Job list */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredJobs.map((job) => (
              <div key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <JobCard job={job} />
                <div style={{ marginTop: '10px' }}>
                  {appliedJobs.has(job.id) ? (
                    <Button variant="outline" size="sm" fullWidth disabled>
                      <CheckCircle2 size={14} color="var(--color-secondary)" />
                      Application Submitted
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => setSelectedJob(job)}
                    >
                      Apply for Job
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Apply to {selectedJob.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Location: {selectedJob.district} | Duration: {selectedJob.duration_days} days
            </p>

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="apply-msg"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Message to Employer (Optional)
                </label>
                <textarea
                  id="apply-msg"
                  rows={4}
                  placeholder="Introduce yourself and explain your relevant experience..."
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setSelectedJob(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
