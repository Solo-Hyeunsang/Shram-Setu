// Shram Setu — Footer Component (Clean White & Light Slate)
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        background: '#FFFFFF',
        color: 'var(--color-text-secondary)',
        padding: '64px 0 32px',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 2px 8px rgba(50, 140, 189, 0.25)',
                }}
              >
                SS
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  fontSize: '18px',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Shram Setu
              </span>
            </div>
            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--color-text-secondary)',
                maxWidth: '280px',
              }}
            >
              Nepal's trusted bridge between skilled workers and employers. Verified credentials, real ratings, direct hiring.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Quick Links
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Find Workers', href: '/search/workers' },
                { label: 'Find Work', href: '/search/jobs' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Get Verified', href: '/login' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary-500)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* For Workers */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              For Workers
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Create Profile',
                'Browse Open Jobs',
                'CTEVT Verification',
                'Build Portfolio',
              ].map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {label}
                </span>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <MapPin size={15} color="var(--color-primary-500)" /> Kathmandu, Nepal
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <Mail size={15} color="var(--color-primary-500)" /> info@shramsetu.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                <Phone size={15} color="var(--color-primary-500)" /> +977-1-XXXXXXX
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border-light)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
            2026 Shram Setu. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary-500)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-tertiary)';
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
