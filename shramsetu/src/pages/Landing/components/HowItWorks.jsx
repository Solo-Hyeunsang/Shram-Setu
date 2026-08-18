// Shram Setu — How It Works Section (Clean White)
import { UserPlus, ShieldCheck, Handshake } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up with your mobile number, select your trade, and add your skills and experience in minutes.',
    color: 'var(--color-primary-500)',
    bgColor: 'var(--color-primary-50)',
  },
  {
    icon: ShieldCheck,
    title: 'Get CTEVT Verified',
    description: 'Submit your vocational credentials for verification. Earn the official badge to gain instant employer trust.',
    color: 'var(--color-secondary)',
    bgColor: '#CCFBF1',
  },
  {
    icon: Handshake,
    title: 'Connect & Work',
    description: 'Employers hire directly. Complete jobs, collect verified reviews, and build a lasting professional record.',
    color: 'var(--color-primary-600)',
    bgColor: 'var(--color-primary-100)',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>A transparent 3-step platform designed for workers and employers in Nepal</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1020px',
            margin: '0 auto',
          }}
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                style={{
                  padding: '36px 28px',
                  borderRadius: 'var(--radius-xl)',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xs)',
                  textAlign: 'left',
                  position: 'relative',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--color-primary-200)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Step number badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-600)',
                    fontWeight: '700',
                    fontSize: '13px',
                    marginBottom: '20px',
                  }}
                >
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    background: step.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={26} color={step.color} strokeWidth={1.75} />
                </div>

                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: '10px',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
