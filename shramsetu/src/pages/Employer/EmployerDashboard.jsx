// Shram Setu — Employer Dashboard
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Briefcase, CheckCircle2, Clock, LogOut } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { JobCard } from '../../components/ui/JobCard';
import { TRADES, DISTRICTS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../api/supabaseClient';

export function EmployerDashboard() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [tradeId, setTradeId] = useState('electrician');
  const [district, setDistrict] = useState('Kathmandu');
  const [duration, setDuration] = useState('7');
  const [budgetMin, setBudgetMin] = useState('10000');
  const [budgetMax, setBudgetMax] = useState('20000');
  const [description, setDescription] = useState('');
  const [postedJobs, setPostedJobs] = useState([
    {
      id: 'emp-1',
      title: 'Residential Wiring Installation',
      trades: { slug: 'electrician', name_en: 'Electrician', icon: 'zap' },
      description: 'Complete electrical wiring for a 3-story home.',
      district: 'Kathmandu',
      duration_days: 14,
      budget_min: 25000,
      budget_max: 40000,
      status: 'open',
      created_at: new Date().toISOString(),
    },
  ]);

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const newJob = {
      id: `job-${Date.now()}`,
      employer_id: user?.id || profile?.id || 'demo-emp',
      title: jobTitle,
      trade_id: tradeId,
      trades: { slug: tradeId, name_en: TRADES.find((t) => t.slug === tradeId)?.nameEn, icon: 'wrench' },
      description,
      district,
      duration_days: parseInt(duration, 10),
      budget_min: parseInt(budgetMin, 10),
      budget_max: parseInt(budgetMax, 10),
      status: 'open',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('jobs').insert({
        id: newJob.id,
        employer_id: newJob.employer_id,
        title: newJob.title,
        trade_id: newJob.trade_id,
        description: newJob.description,
        district: newJob.district,
        duration_days: newJob.duration_days,
        budget_min: newJob.budget_min,
        budget_max: newJob.budget_max,
        status: 'open',
      });
    } catch (err) {
      console.warn('Job insert in Supabase:', err);
    }

    setPostedJobs([newJob, ...postedJobs]);
    setShowPostModal(false);
    setJobTitle('');
    setDescription('');
  };

  const stats = [
    { label: 'Active Jobs', value: postedJobs.length, icon: Briefcase, color: 'var(--color-primary-500)' },
    { label: 'Total Applicants', value: '5', icon: Users, color: 'var(--color-accent)' },
    { label: 'Completed Jobs', value: '8', icon: CheckCircle2, color: 'var(--color-secondary)' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>
                Employer Dashboard
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Manage your job postings and applicants
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => setShowPostModal(true)}>
                <Plus size={16} />
                Post a New Job
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                style={{
                  borderColor: '#FECACA',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontWeight: '600',
                }}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-xl)',
                    padding: '20px',
                    border: '1px solid var(--color-border-light)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{s.label}</span>
                    <Icon size={18} color={s.color} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* My Posted Jobs */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
              Your Job Postings ({postedJobs.length})
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
              }}
            >
              {postedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Post Job Modal */}
      {showPostModal && (
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
          onClick={() => setShowPostModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
              Post a New Job
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              Fill in the details to find verified skilled workers
            </p>

            <form onSubmit={handlePostJob}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="job-title-input"
                  style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                >
                  Job Title *
                </label>
                <input
                  id="job-title-input"
                  type="text"
                  placeholder="e.g. Electrical rewiring for new house"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label
                    htmlFor="job-trade-select"
                    style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                  >
                    Required Trade
                  </label>
                  <select
                    id="job-trade-select"
                    value={tradeId}
                    onChange={(e) => setTradeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      background: '#FFFFFF',
                    }}
                  >
                    {TRADES.map((t) => (
                      <option key={t.slug} value={t.slug}>{t.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="job-district-select"
                    style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                  >
                    District / Location
                  </label>
                  <select
                    id="job-district-select"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      background: '#FFFFFF',
                    }}
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label
                    htmlFor="budget-min-input"
                    style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                  >
                    Min Budget (NPR)
                  </label>
                  <input
                    id="budget-min-input"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="budget-max-input"
                    style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                  >
                    Max Budget (NPR)
                  </label>
                  <input
                    id="budget-max-input"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="job-desc-input"
                  style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}
                >
                  Job Description
                </label>
                <textarea
                  id="job-desc-input"
                  rows={3}
                  placeholder="Describe scope of work, timeline, and requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setShowPostModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Publish Job
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
