// Shram Setu — Worker Dashboard
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, Briefcase, Clock, Upload, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { VerificationBadge } from '../../components/ui/VerificationBadge';
import { AvailabilityDot } from '../../components/ui/AvailabilityDot';
import { useAuth } from '../../hooks/useAuth';

export function WorkerDashboard() {
  const { profile, signOut } = useAuth();
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [availability, setAvailability] = useState('available');
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const stats = [
    { label: 'Rating', value: '4.8', icon: Star, color: 'var(--color-accent)' },
    { label: 'Completed Jobs', value: '14', icon: CheckCircle2, color: 'var(--color-secondary)' },
    { label: 'Active Applications', value: '2', icon: Briefcase, color: 'var(--color-primary-500)' },
    { label: 'Profile Views', value: '86', icon: Clock, color: 'var(--color-primary-600)' },
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
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>
                Namaste, {profile?.full_name || 'Worker'}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Manage your credentials, jobs, and CTEVT verification
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Availability selector */}
              <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                {['available', 'busy', 'not_taking_work'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAvailability(status)}
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
                  <VerificationBadge status={profile?.verification_status || 'unverified'} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Verified workers receive 3x more job requests and priority search ranking
                </p>
              </div>
            </div>

            {profile?.verification_status !== 'verified' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setVerificationRequested(true)}
                disabled={verificationRequested}
              >
                {verificationRequested ? 'Request Submitted' : 'Request CTEVT Verification'}
              </Button>
            )}
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
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{stat.label}</span>
                    <Icon size={18} color={stat.color} />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
