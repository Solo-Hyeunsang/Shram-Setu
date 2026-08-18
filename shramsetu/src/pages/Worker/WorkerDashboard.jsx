// Shram Setu — Worker Dashboard
import { useState } from 'react';
import { ShieldCheck, Star, Briefcase, Clock, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { VerificationBadge } from '../../components/ui/VerificationBadge';
import { AvailabilityDot } from '../../components/ui/AvailabilityDot';
import { useAuth } from '../../hooks/useAuth';

export function WorkerDashboard() {
  const { profile } = useAuth();
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [availability, setAvailability] = useState('available');

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

          {/* Verification banner / card */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)',
              borderRadius: 'var(--radius-2xl)',
              padding: '32px',
              color: '#FFFFFF',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ maxWidth: '540px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', marginBottom: '12px' }}>
                <ShieldCheck size={14} />
                CTEVT Verification Program
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
                Get Verified by CTEVT to Unlock More Jobs
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: '1.5' }}>
                Verified workers get prioritized in employer searches and earn up to 40% higher average daily wages.
              </p>
            </div>

            <div>
              {verificationRequested ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: 'var(--radius-lg)' }}>
                  <CheckCircle2 size={18} color="#A7F3D0" />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Request Under Review by CTEVT</span>
                </div>
              ) : (
                <Button
                  size="md"
                  onClick={() => setVerificationRequested(true)}
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--color-primary-800)',
                    fontWeight: '600',
                  }}
                >
                  <Upload size={16} />
                  Submit CTEVT Certificate
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
