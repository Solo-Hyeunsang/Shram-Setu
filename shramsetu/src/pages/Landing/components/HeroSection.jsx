// Shram Setu — Hero Section (Clean White Background)
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function HeroSection() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '500+', label: 'Skilled Workers' },
    { icon: Briefcase, value: '200+', label: 'Jobs Completed' },
    { icon: ShieldCheck, value: '150+', label: 'CTEVT Verified' },
  ];

  return (
    <section
      className="clean-hero-bg"
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '100px',
        paddingBottom: '60px',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Trust pill */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-50)',
              border: '1px solid var(--color-primary-200)',
              marginBottom: '24px',
              fontSize: '13px',
              color: 'var(--color-primary-700)',
              fontWeight: '600',
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary-500)" />
            Government-Backed CTEVT Verification Network
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 3.75rem)',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              lineHeight: '1.15',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}
          >
            Nepal's Trusted Bridge Between{' '}
            <span className="gradient-text">
              Skilled Workers
            </span>
            {' & '}
            <span style={{ color: 'var(--color-text-primary)' }}>
              Employers
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up animate-delay-100"
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.7',
              maxWidth: '640px',
              margin: '0 auto 36px',
            }}
          >
            Connect directly with CTEVT-verified electricians, plumbers, masons, and technicians. 
            Transparent ratings, zero hidden commissions, and reliable hiring.
          </p>

          {/* Actions */}
          <div
            className="animate-fade-in-up animate-delay-200"
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '56px',
            }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/search/workers')}
              style={{
                boxShadow: '0 4px 16px rgba(50, 140, 189, 0.35)',
              }}
            >
              Find Skilled Workers
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              style={{
                background: '#FFFFFF',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                fontWeight: '600',
              }}
            >
              Join as a Worker
            </Button>
          </div>

          {/* Clean Stat Cards */}
          <div
            className="animate-fade-in-up animate-delay-300"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '18px 12px',
                    borderRadius: 'var(--radius-xl)',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Icon
                    size={22}
                    color="var(--color-primary-500)"
                    style={{ marginBottom: '6px' }}
                  />
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '26px',
                      fontWeight: '800',
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.2',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--color-text-secondary)',
                      marginTop: '2px',
                      fontWeight: '500',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
