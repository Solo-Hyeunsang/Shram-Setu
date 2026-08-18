// Shram Setu — Login Page (Clean White Background)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { signInWithPhone, signInWithEmail } from '../../api/authApi';
import { Button } from '../../components/ui/Button';

export function Login() {
  const [authMode, setAuthMode] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+977${phone.replace(/^0+/, '')}`;
    const { error: authError } = await signInWithPhone(formattedPhone);
    setLoading(false);

    navigate(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}`);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error: authError } = await signInWithEmail(email);
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Failed to send magic link. Please try again.');
    } else {
      setMagicLinkSent(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: 'var(--color-background-subtle)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '16px',
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
                fontSize: '20px',
                color: 'var(--color-text-primary)',
              }}
            >
              Shram Setu
            </span>
          </Link>

          <h2
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
            }}
          >
            Welcome to Shram Setu
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Sign in to access your jobs, profile, and verification
          </p>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-background-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode('phone'); setError(null); setMagicLinkSent(false); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
              background: authMode === 'phone' ? '#FFFFFF' : 'transparent',
              color: authMode === 'phone' ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
              boxShadow: authMode === 'phone' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            <Phone size={14} />
            Phone OTP
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
              background: authMode === 'email' ? '#FFFFFF' : 'transparent',
              color: authMode === 'email' ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
              boxShadow: authMode === 'email' ? 'var(--shadow-xs)' : 'none',
            }}
          >
            <Mail size={14} />
            Email Link
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEE2E2',
              color: 'var(--color-danger)',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {authMode === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="phone-input"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                Mobile Phone Number
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                }}
              >
                <span
                  style={{
                    padding: '12px 14px',
                    background: 'var(--color-background-subtle)',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-secondary)',
                    borderRight: '1px solid var(--color-border)',
                  }}
                >
                  +977
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-primary)',
                  }}
                  autoFocus
                />
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--color-text-tertiary)',
                  marginTop: '6px',
                }}
              >
                We'll send a 6-digit verification code via SMS
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
            >
              Send Verification Code
              <ArrowRight size={16} />
            </Button>
          </form>
        )}

        {authMode === 'email' && (
          <div>
            {magicLinkSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={44} color="var(--color-secondary)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Magic Link Sent</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                  We've sent a login link to <strong>{email}</strong>. Check your inbox to sign in instantly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMagicLinkSent(false)}
                  style={{ marginTop: '16px' }}
                >
                  Try Another Email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="email-input"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '15px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-primary)',
                    }}
                    autoFocus
                  />
                  <span
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      marginTop: '6px',
                    }}
                  >
                    Recommended for employers and contractors
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                >
                  Send Magic Link
                  <ArrowRight size={16} />
                </Button>
              </form>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--color-text-tertiary)',
            fontSize: '12px',
          }}
        >
          <ShieldCheck size={14} color="var(--color-secondary)" />
          Protected by Supabase Auth & CTEVT Verification Network
        </div>
      </div>
    </div>
  );
}
