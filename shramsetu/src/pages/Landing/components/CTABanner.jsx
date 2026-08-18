// Shram Setu — CTA Banner Component (Clean White Section)
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function CTABanner() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: '80px 0',
        background: '#FFFFFF',
      }}
    >
      <div className="container">
        <div
          style={{
            maxWidth: '1060px',
            margin: '0 auto',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 50%, var(--color-primary-700) 100%)',
            padding: '64px 36px',
            textAlign: 'center',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(50, 140, 189, 0.2)',
          }}
        >
          {/* Subtle background circle decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              <ShieldCheck size={16} />
              Join Nepal's Leading Skilled Workforce Network
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: '800',
                color: '#FFFFFF',
                lineHeight: '1.2',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              Ready to Hire Verified Talent or Find Work?
            </h2>

            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.6',
                marginBottom: '36px',
              }}
            >
              Sign up in minutes with your phone number. No commissions, no middle agencies—just direct connections.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                style={{
                  background: '#FFFFFF',
                  color: 'var(--color-primary-700)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  fontWeight: '700',
                }}
              >
                <Briefcase size={18} />
                Register as Worker
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/search/workers')}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(8px)',
                  fontWeight: '600',
                }}
              >
                Browse Workers
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
