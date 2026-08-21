// Shram Setu — Employer Dashboard (Real Data & Live Supabase Integration)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Briefcase, CheckCircle2, Clock, LogOut, MapPin, X, ArrowRight, User, Phone } from 'lucide-react';
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
  const activeUserId = user?.id || profile?.id;

  const [showPostModal, setShowPostModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [tradeId, setTradeId] = useState('electrician');
  const [district, setDistrict] = useState(profile?.district || 'Kathmandu');
  const [duration, setDuration] = useState('7');
  const [budgetMin, setBudgetMin] = useState('10000');
  const [budgetMax, setBudgetMax] = useState('20000');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applicants'

  // Fetch only this employer's actual jobs from Supabase
  useEffect(() => {
    if (!activeUserId) {
      setLoading(false);
      return;
    }

    const fetchEmployerData = async () => {
      setLoading(true);
      try {
        // 1. Fetch employer's actual posted jobs
        const { data: jobsData, error: jobsErr } = await supabase
          .from('jobs')
          .select('*, trades (slug, name_en, icon)')
          .eq('employer_id', activeUserId)
          .order('created_at', { ascending: false });

        if (!jobsErr && jobsData) {
          setPostedJobs(jobsData);
        } else {
          // Fallback to local storage for offline / testing persistence
          const saved = localStorage.getItem(`shramsetu_emp_jobs_${activeUserId}`);
          if (saved) {
            setPostedJobs(JSON.parse(saved));
          } else {
            setPostedJobs([]);
          }
        }

        // 2. Fetch applicants for this employer's jobs
        if (jobsData && jobsData.length > 0) {
          const jobIds = jobsData.map((j) => j.id);
          const { data: appData, error: appErr } = await supabase
            .from('job_applications')
            .select('*, jobs (title, district), profiles:worker_id (full_name, phone, district)')
            .in('job_id', jobIds)
            .order('created_at', { ascending: false });

          if (!appErr && appData) {
            setApplicants(appData);
          }
        }
      } catch (err) {
        console.warn('Employer data load:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, [activeUserId]);

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!activeUserId) return;

    setSubmitting(true);
    const newJobId = `job-${Date.now()}`;
    const selectedTradeObj = TRADES.find((t) => t.slug === tradeId);

    const newJob = {
      id: newJobId,
      employer_id: activeUserId,
      title: jobTitle,
      trade_id: tradeId,
      trades: {
        slug: tradeId,
        name_en: selectedTradeObj?.nameEn || tradeId,
        icon: 'wrench',
      },
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

    const updatedJobs = [newJob, ...postedJobs];
    setPostedJobs(updatedJobs);
    localStorage.setItem(`shramsetu_emp_jobs_${activeUserId}`, JSON.stringify(updatedJobs));

    setShowPostModal(false);
    setJobTitle('');
    setDescription('');
    setSubmitting(false);
  };

  const activeJobsCount = postedJobs.filter((j) => j.status === 'open').length;
  const completedJobsCount = postedJobs.filter((j) => j.status === 'completed').length;
  const totalApplicantsCount = applicants.length;

  const stats = [
    { label: 'Active Jobs', value: activeJobsCount, icon: Briefcase, color: 'var(--color-primary-500)' },
    { label: 'Total Applicants', value: totalApplicantsCount, icon: Users, color: 'var(--color-accent)' },
    { label: 'Completed Projects', value: completedJobsCount, icon: CheckCircle2, color: 'var(--color-secondary)' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          {/* Header Title & Actions */}
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
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                Namaste, {profile?.full_name || 'Employer'}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Manage your job postings, view worker applicants, and hire talent
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

          {/* Dynamic Real Stats Grid */}
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
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{s.label}</span>
                    <Icon size={18} color={s.color} />
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => setActiveTab('jobs')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'jobs' ? '2.5px solid var(--color-primary-600)' : '2.5px solid transparent',
                color: activeTab === 'jobs' ? 'var(--color-primary-700)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === 'jobs' ? '700' : '500',
                fontSize: '14.5px',
                cursor: 'pointer',
              }}
            >
              Your Job Postings ({postedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'applicants' ? '2.5px solid var(--color-primary-600)' : '2.5px solid transparent',
                color: activeTab === 'applicants' ? 'var(--color-primary-700)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === 'applicants' ? '700' : '500',
                fontSize: '14.5px',
                cursor: 'pointer',
              }}
            >
              Worker Applicants ({applicants.length})
            </button>
          </div>

          {/* Tab 1: Your Posted Jobs */}
          {activeTab === 'jobs' && (
            <div>
              {postedJobs.length === 0 ? (
                <div
                  style={{
                    padding: '56px 24px',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-2xl)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Briefcase size={44} color="var(--color-text-tertiary)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                    No job postings yet
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
                    Post your first project or maintenance requirement to receive applications from verified skilled workers in Nepal.
                  </p>
                  <Button variant="primary" onClick={() => setShowPostModal(true)}>
                    <Plus size={16} />
                    Post Your First Job
                  </Button>
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Tab 2: Applicants */}
          {activeTab === 'applicants' && (
            <div>
              {applicants.length === 0 ? (
                <div
                  style={{
                    padding: '56px 24px',
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-2xl)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Users size={44} color="var(--color-text-tertiary)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                    No applications received yet
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 24px' }}>
                    When certified workers apply to your open job listings, their profiles and contact details will appear here.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/search/workers')}>
                    Browse Available Workers
                    <ArrowRight size={16} />
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applicants.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-xl)',
                        padding: '20px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>
                          {app.profiles?.full_name || 'Skilled Worker'}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 6px 0' }}>
                          Applied for: <strong>{app.jobs?.title || 'Job'}</strong> ({app.jobs?.district})
                        </p>
                        {app.message && (
                          <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', margin: 0, fontStyle: 'italic' }}>
                            "{app.message}"
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {app.profiles?.phone && (
                          <a
                            href={`tel:${app.profiles.phone}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--color-primary-50)',
                              color: 'var(--color-primary-700)',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: '600',
                              border: '1px solid var(--color-primary-200)',
                            }}
                          >
                            <Phone size={14} />
                            {app.profiles.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Post Job Modal */}
      {showPostModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
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
              maxWidth: '540px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-2xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                  Post a New Job
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Fill in the details to find verified skilled workers in Nepal
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
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

            <form onSubmit={handlePostJob}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electrical rewiring for 3-story house"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Required Profession
                  </label>
                  <select
                    value={tradeId}
                    onChange={(e) => setTradeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '13.5px',
                      background: '#FFFFFF',
                    }}
                  >
                    {TRADES.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    District / Location
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '13.5px',
                      background: '#FFFFFF',
                    }}
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '13.5px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Min Budget (NPR)
                  </label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '13.5px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                    Max Budget (NPR)
                  </label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontSize: '13.5px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Job Description & Scope of Work
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope of work, site conditions, materials provided..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
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
                <Button type="button" variant="ghost" onClick={() => setShowPostModal(false)} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                  }}
                >
                  Publish Job Posting
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
