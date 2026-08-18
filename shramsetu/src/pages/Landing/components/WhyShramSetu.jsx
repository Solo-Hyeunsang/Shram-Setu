// Shram Setu — Why Shram Setu (Clean White)
import { ShieldCheck, Star, Users, CheckCircle2 } from 'lucide-react';

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: 'CTEVT Verification',
    description: 'Workers are certified against official CTEVT standards. Look for the verified shield badge.',
    color: 'var(--color-secondary)',
    bgColor: '#CCFBF1',
  },
  {
    icon: Star,
    title: 'Authentic Ratings',
    description: 'Direct reviews left by employers after completed projects. Transparent work histories.',
    color: 'var(--color-accent)',
    bgColor: '#FEF3C7',
  },
  {
    icon: Users,
    title: 'Direct Hiring',
    description: 'No middleman agency fees or commission deductions. Direct phone and chat coordination.',
    color: 'var(--color-primary-500)',
    bgColor: 'var(--color-primary-50)',
  },
  {
    icon: CheckCircle2,
    title: '100% Free Platform',
    description: 'Completely free for workers to build profiles and for employers to post and search jobs.',
    color: 'var(--color-primary-600)',
    bgColor: 'var(--color-primary-100)',
  },
];

export function WhyShramSetu() {
  return (
    <section className="section" style={{ background: 'var(--color-background-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Shram Setu</h2>
          <p>Built to elevate skilled craftsmanship and empower fair employment across Nepal</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '1060px',
            margin: '0 auto',
          }}
        >
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                style={{
                  padding: '32px 24px',
                  borderRadius: 'var(--radius-xl)',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all var(--transition-base)',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-200)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-lg)',
                    background: point.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                  }}
                >
                  <Icon size={24} color={point.color} strokeWidth={1.75} />
                </div>

                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {point.title}
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
