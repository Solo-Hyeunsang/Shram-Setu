// Shram Setu — Worker Dashboard (Real Data & Live Supabase Integration)
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Star, Briefcase, Clock, Upload, CheckCircle2, AlertCircle, LogOut, ArrowRight, MapPin, Award, Check } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { VerificationBadge } from '../../components/ui/VerificationBadge';
import { AvailabilityDot } from '../../components/ui/AvailabilityDot';
import { JobCard } from '../../components/ui/JobCard';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../api/supabaseClient';

export function WorkerDashboard() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const activeUserId = user?.id || profile?.id;

  const [verificationRequested, setVerificationRequested] = useState(false);
  const [availability, setAvailability] = useState('available');
  const [workerData, setWorkerData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch actual worker data from Supabase
  useEffect(() => {
    if (!activeUserId) {
      setLoading(false);
      return;
    }

    const fetchWorkerData = async () => {
      setLoading(true);
      try {
        // 1. Fetch worker profile
        const { data: wpData } = await supabase
          .from('worker_profiles')
          .select('*')
          .eq('id', activeUserId)
          .single();

        if (wpData) {
          setWorkerData(wpData);
          if (wpData.availability) setAvailability(wpData.availability);
          if (wpData.verification_status === 'pending') setVerificationRequested(true);
        }

        // 2. Fetch actual job applications for this worker
        const { data: appData } = await supabase
          .from('job_applications')
          .select('*, jobs (*, trades (*))')
          .eq('worker_id', activeUserId)
          .order('created_at', { ascending: false });

        if (appData && appData.length > 0) {
          setAppliedJobs(appData);
        } else {
          setAppliedJobs([]);
        }
      } catch (err) {
        console.warn('Worker profile load:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [activeUserId]);

  const handleUpdateAvailability = async (status) => {
    setAvailability(status);
    if (!activeUserId) return;
    try {
      await supabase
        .from('worker_profiles')
        .update({ availability: status })
        .eq('id', activeUserId);
    } catch (err) {
      console.warn('Availability update:', err);
    }
  };

  const handleRequestVerification = async () => {
    setVerificationRequested(true);
    if (!activeUserId) return;
    try {
      await supabase
        .from('worker_profiles')
        .update({ verification_status: 'pending' })
        .eq('id', activeUserId);
    } catch (err) {
      console.warn('Verification request:', err);
    }
  };

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const ratingValue = workerData?.average_rating ? `${workerData.average_rating} (${workerData.total_reviews || 0})` : 'New';
  const completedJobsCount = workerData?.completed_jobs || 0;
  const activeApplicationsCount = appliedJobs.filter((a) => a.status === 'pending').length;
  const primaryTrade = workerData?.primary_trade || profile?.primary_trade || 'Skilled Professional';

  const stats = [
    { label: 'Rating', value: ratingValue, icon: Star, color: 'var(--color-accent)' },
    { label: 'Completed Jobs', value: completedJobsCount, icon: CheckCircle2, color: 'var(--color-secondary)' },
    { label: 'Active Applications', value: activeApplicationsCount, icon: Briefcase, color: 'var(--color-primary-500)' },
    { label: 'Profession', value: primaryTrade.charAt(0).toUpperCase() + primaryTrade.slice(1), icon: Award, color: 'var(--color-primary-700)' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          {/* Welcome header */}
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
                Namaste, {profile?.full_name || 'Worker'}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Manage your credentials, job applications, and CTEVT verification status
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Availability selector */}
              <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                {['available', 'busy', 'not_taking_work'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleUpdateAvailability(status)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: availability === status ? 'var(--color-primary-50)' : 'transparent',
                      color: availability === status ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                      fontWeight: availability === status ? '600' : '400',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <AvailabilityDot status={status} size={6} />
                    {status === 'available' ? 'Available' : status === 'busy' ? 'Busy' : 'Not Taking Work'}
                  </button>
                ))}
              </div>

              {/* Explicit Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                style={{
                  borderColor: '#FECACA',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontWeight: '600',
                }}
              >
                <LogOut size={14} />
                Logout
              </Button>
            </div>
          </div>

          {/* Verification banner */}
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-2xl)',
              background: '#FFFFFF',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={24} color="var(--color-primary-600)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>CTEVT Verification Status</h3>
                  <VerificationBadge status={workerData?.verification_status || profile?.verification_status || 'unverified'} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Verified workers receive 3x more job requests and priority search ranking across Nepal
                </p>
              </div>
            </div>

            {(workerData?.verification_status || profile?.verification_status) !== 'verified' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRequestVerification}
                disabled={verificationRequested}
              >
                {verificationRequested ? 'Request Submitted' : 'Request CTEVT Verification'}
              </Button>
            )}
          </div>

          {/* Dynamic Real Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-xl)',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border-light)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{stat.label}</span>
                    <Icon size={18} color={stat.color} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applications Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
                Your Job Applications ({appliedJobs.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/search/jobs')}>
                Browse All Open Jobs
                <ArrowRight size={15} />
              </Button>
            </div>

            {appliedJobs.length === 0 ? (
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
                  You haven't applied to any jobs yet
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
                  Explore verified employer job listings in your district to apply and find work.
                </p>
                <Button variant="primary" onClick={() => navigate('/search/jobs')}>
                  Find Work Now
                  <ArrowRight size={16} />
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {appliedJobs.map((app) => (
                  <div key={app.id} style={{ position: 'relative' }}>
                    {app.jobs ? (
                      <JobCard job={app.jobs} />
                    ) : (
                      <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                        <h4 style={{ margin: '0 0 6px 0' }}>Job Application #{app.job_id}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>Status: {app.status}</p>
                      </div>
                    )}
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
                      Applied ({app.status || 'Pending'})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
