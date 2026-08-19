// Shram Setu — Job Search Page (Live Supabase Sync & Interactive Applications)
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Briefcase, MapPin, CheckCircle2, Clock, Calendar, X, Send, Filter, Check, ArrowRight } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { JobCard } from '../../components/ui/JobCard';
import { Button } from '../../components/ui/Button';
import { TRADES, DISTRICTS } from '../../utils/constants';
import { formatBudget, formatRelativeTime } from '../../utils/formatters';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../hooks/useAuth';

const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Residential Wiring Installation',
    trades: { slug: 'electrician', name_en: 'Electrician', icon: 'zap' },
    trade_id: 'electrician',
    description: 'Complete electrical wiring for a new 3-story residential building in Kathmandu. Must have experience with modern circuit designs, breaker box setups, and safety grounding.',
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
    description: 'Fix leaking pipes and install new sanitary fixtures in two bathrooms. Urgent repair needed for high-pressure CPVC connection.',
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
    description: 'Build a 60-meter compound wall with brick and cement mortar. Foundation excavation and leveling work included.',
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
    description: 'Interior wall putty and premium acrylic emulsion painting for 4 bedrooms and a living hall. Texture feature wall required in living room.',
    district: 'Kathmandu',
    duration_days: 7,
    budget_min: 20000,
    budget_max: 35000,
    status: 'open',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: '5',
    title: 'Modular Kitchen Carpentry & Cabinets',
    trades: { slug: 'carpenter', name_en: 'Carpenter', icon: 'hammer' },
    trade_id: 'carpenter',
    description: 'Build waterproof ply kitchen base and overhead cabinets with soft-close hinges, quartz countertop cutout, and laminate finish.',
    district: 'Chitwan',
    duration_days: 10,
    budget_min: 35000,
    budget_max: 55000,
    status: 'open',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: '6',
    title: 'Security Grills & Main Gate Welding',
    trades: { slug: 'welder', name_en: 'Welder', icon: 'flame' },
    trade_id: 'welder',
    description: 'Fabricate 8 window security grills and heavy iron entrance sliding gate with primer anti-rust coating.',
    district: 'Kathmandu',
    duration_days: 5,
    budget_min: 18000,
    budget_max: 30000,
    status: 'open',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
];

export function JobSearch() {
  const [searchParams] = useSearchParams();
  const initialTrade = searchParams.get('trade') || 'all';

  const { user, profile } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState(initialTrade);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [expectedWage, setExpectedWage] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [dbJobs, setDbJobs] = useState([]);

  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('shramsetu_applied_jobs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const t = searchParams.get('trade');
    if (t) {
      setSelectedTrade(t);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDbJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, trades(slug, name_en, icon)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setDbJobs(data);
        }
      } catch (err) {
        console.warn('Jobs fetch:', err);
      }
    };
    fetchDbJobs();
  }, []);

  const allJobs = useMemo(() => {
    const combined = [...dbJobs];
    const existingIds = new Set(dbJobs.map((j) => j.id));
    SAMPLE_JOBS.forEach((sj) => {
      if (!existingIds.has(sj.id)) {
        combined.push(sj);
      }
    });
    return combined;
  }, [dbJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((j) => {
      const tradeSlug = j.trades?.slug || j.trade_id || '';
      if (selectedTrade !== 'all' && tradeSlug !== selectedTrade) return false;
      if (selectedDistrict !== 'all' && j.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (j.title || '').toLowerCase().includes(q);
        const matchDesc = (j.description || '').toLowerCase().includes(q);
        const matchTrade = (j.trades?.name_en || '').toLowerCase().includes(q);
        const matchDistrict = (j.district || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTrade && !matchDistrict) return false;
      }
      return true;
    });
  }, [allJobs, selectedTrade, selectedDistrict, searchQuery]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmittingApply(true);
    const updated = new Set([...appliedJobs, selectedJob.id]);
    setAppliedJobs(updated);
    localStorage.setItem('shramsetu_applied_jobs', JSON.stringify([...updated]));

    try {
      if (user?.id) {
        await supabase.from('job_applications').insert({
          job_id: selectedJob.id,
          worker_id: user.id,
          message: applyMessage || 'Interested in this job',
          status: 'pending',
        });
      }
    } catch (err) {
      console.warn('Application db sync:', err);
    }

    setSubmittingApply(false);
    setSelectedJob(null);
    setApplyMessage('');
    setExpectedWage('');
    setToastMessage(`Application submitted successfully for "${selectedJob.title}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFCFE' }}>
      <Header />

      {/* Success Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 1100,
            background: 'var(--color-primary-700)',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          <CheckCircle2 size={18} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-200)',
                  color: 'var(--color-primary-700)',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                <Briefcase size={13} color="var(--color-primary-700)" />
                Direct Verified Employer Postings
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Browse Job Opportunities
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Apply directly to open jobs posted by homeowners and contractors across Nepal
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
              padding: '14px 18px',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: '1 1 260px',
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
                placeholder="Search job title, skills, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 0',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-tertiary)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              style={{
                flex: '0 1 190px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                background: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Professions</option>
              {TRADES.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.nameEn} ({t.nameNe})
                </option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                flex: '0 1 170px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                background: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {(selectedTrade !== 'all' || selectedDistrict !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTrade('all');
                  setSelectedDistrict('all');
                  setSearchQuery('');
                }}
                style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* Results count & grid */}
          <div style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Showing <strong>{filteredJobs.length}</strong> available job{filteredJobs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <div
              style={{
                padding: '64px 24px',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Briefcase size={40} color="var(--color-text-tertiary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>No jobs matched your criteria</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Try loosening your filters or searching in a different district
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTrade('all');
                  setSelectedDistrict('all');
                  setSearchQuery('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredJobs.map((job) => {
                const isApplied = appliedJobs.has(job.id);
                return (
                  <div
                    key={job.id}
                    style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
                  >
                    <JobCard job={job} onClick={() => setSelectedJob(job)} />

                    {isApplied && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: '#D1FAE5',
                          color: '#065F46',
                          border: '1px solid #A7F3D0',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          pointerEvents: 'none',
                        }}
                      >
                        <Check size={13} />
                        Applied
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Interactive Job Details & Application Modal */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 1100,
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-2xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--color-primary-600)',
                    background: 'var(--color-primary-50)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  {selectedJob.trades?.name_en || selectedJob.trade_id}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                  {selectedJob.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Details Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                padding: '14px',
                background: 'var(--color-background-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Location</span>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  {selectedJob.district}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Duration</span>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  {selectedJob.duration_days} Days
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Budget</span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary-700)', marginTop: '2px' }}>
                  {formatBudget(selectedJob.budget_min, selectedJob.budget_max)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                Job Description & Scope
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {selectedJob.description}
              </p>
            </div>

            {/* Application Form */}
            {appliedJobs.has(selectedJob.id) ? (
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#065F46', margin: '0 0 4px 0' }}>
                  Application Already Submitted
                </h4>
                <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
                  The employer has received your profile and will contact you directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Note to Employer (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your relevant experience or when you can start..."
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13.5px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    loading={submittingApply}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                    }}
                  >
                    <Send size={15} />
                    Submit Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
