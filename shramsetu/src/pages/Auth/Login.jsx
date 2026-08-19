// Shram Setu — Login Page (Direct ClerkJS Client Integration)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useClerk } from '@clerk/react';
import { Button } from '../../components/ui/Button';

export function Login() {
  const [authMode, setAuthMode] = useState('email');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const clerk = useClerk();

  const ensureClerk = async (timeoutMs = 5000) => {
    if (clerk?.loaded && clerk?.client) return true;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (clerk?.loaded && clerk?.client) return true;
      await new Promise((r) => setTimeout(r, 100));
    }
    return clerk?.loaded && clerk?.client;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const ready = await ensureClerk();
      if (!ready || !clerk.client) {
        throw new Error('Authentication service is still initializing. Please try again.');
      }

      console.log('Step 1: Attempting SignIn for:', cleanEmail);
      let isExistingUser = false;

      // 1. Try Sign In
      try {
        const signInRes = await clerk.client.signIn.create({
          identifier: cleanEmail,
        });
        console.log('SignIn created:', signInRes);

        const emailFactor = signInRes.supportedFirstFactors?.find(
          (f) => f.strategy === 'email_code'
        );

        if (emailFactor) {
          console.log('Preparing email code factor for existing account...');
          await clerk.client.signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          isExistingUser = true;
          setLoading(false);
          navigate(`/verify-otp?email=${encodeURIComponent(cleanEmail)}&mode=signin_email`);
          return;
        }
      } catch (signInErr) {
        console.warn('Account not found in SignIn, proceeding to SignUp:', signInErr);
      }

      // 2. Try Sign Up for new account
      if (!isExistingUser) {
        console.log('Step 2: Creating SignUp for:', cleanEmail);
        await clerk.client.signUp.create({
          emailAddress: cleanEmail,
        });

        console.log('Dispatching email OTP verification...');
        await clerk.client.signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        console.log('Verification email code dispatched successfully!');
        setLoading(false);
        navigate(`/verify-otp?email=${encodeURIComponent(cleanEmail)}&mode=signup_email`);
        return;
      }
    } catch (err) {
      console.error('Email Auth Error:', err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        err.message ||
        'Failed to send verification code. Please check your email address.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    const rawDigits = phone.replace(/\D/g, '');
    const formattedPhone = phone.startsWith('+') ? phone : `+977${rawDigits.replace(/^0+/, '')}`;

    try {
      const ready = await ensureClerk();
      if (!ready || !clerk.client) {
        throw new Error('Authentication service is still initializing. Please try again.');
      }

      console.log('Step 1: Attempting Phone SignIn for:', formattedPhone);
      let isExistingUser = false;

      try {
        const signInRes = await clerk.client.signIn.create({
          identifier: formattedPhone,
        });

        const phoneFactor = signInRes.supportedFirstFactors?.find(
          (f) => f.strategy === 'phone_code'
        );

        if (phoneFactor) {
          console.log('Preparing phone code factor for existing account...');
          await clerk.client.signIn.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId: phoneFactor.phoneNumberId,
          });
          isExistingUser = true;
          setLoading(false);
          navigate(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}&mode=signin`);
          return;
        }
      } catch (signInErr) {
        console.warn('Phone SignIn check failed, proceeding to SignUp:', signInErr);
      }

      if (!isExistingUser) {
        console.log('Step 2: Creating Phone SignUp for:', formattedPhone);
        await clerk.client.signUp.create({
          phoneNumber: formattedPhone,
        });

        console.log('Dispatching SMS verification code...');
        await clerk.client.signUp.preparePhoneNumberVerification({
          strategy: 'phone_code',
        });

        setLoading(false);
        navigate(`/verify-otp?phone=${encodeURIComponent(formattedPhone)}&mode=signup`);
        return;
      }
    } catch (err) {
      console.error('Phone Auth Error:', err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        err.message ||
        'Failed to send SMS code. Please check your phone number.';
      setError(errMsg);
    } finally {
      setLoading(false);
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
        background: '#F8FAFC',
      }}
    >
      <div id="clerk-captcha" />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '24px',
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
            <img
              src="/logo.png"
              alt="Shram Setu Logo"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
              }}
            />
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
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
              fontFamily: 'var(--font-display)',
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

        {/* Auth Mode Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-background-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: authMode === 'email' ? '#FFFFFF' : 'transparent',
              color: authMode === 'email' ? 'var(--color-primary-700)' : 'var(--color-text-secondary)',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: authMode === 'email' ? 'var(--shadow-xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Mail size={15} />
            Email OTP
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: authMode === 'phone' ? '#FFFFFF' : 'transparent',
              color: authMode === 'phone' ? 'var(--color-primary-700)' : 'var(--color-text-secondary)',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: authMode === 'phone' ? 'var(--shadow-xs)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Phone size={15} />
            Phone OTP
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#991B1B',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Email Login Form */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--color-border)',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  background: '#FFFFFF',
                }}
                autoFocus
              />

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-tertiary)',
                  marginTop: '8px',
                }}
              >
                We will email you a 6-digit verification code
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                boxShadow: '0 4px 14px rgba(13, 43, 82, 0.28)',
              }}
            >
              Send Verification Code
              <ArrowRight size={16} />
            </Button>
          </form>
        )}

        {/* Phone Login Form */}
        {authMode === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13.5px',
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
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--color-border)',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <span
                  style={{
                    padding: '12px 14px',
                    background: 'var(--color-background-subtle)',
                    borderRight: '1px solid var(--color-border)',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-secondary)',
                    userSelect: 'none',
                  }}
                >
                  +977
                </span>

                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    letterSpacing: '0.02em',
                  }}
                  autoFocus
                />
              </div>

              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-tertiary)',
                  marginTop: '8px',
                }}
              >
                We will send a 6-digit verification code via SMS
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                boxShadow: '0 4px 14px rgba(13, 43, 82, 0.28)',
              }}
            >
              Send Verification Code
              <ArrowRight size={16} />
            </Button>
          </form>
        )}

        {/* Security / Verification Seal */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--color-text-tertiary)',
            fontSize: '12px',
          }}
        >
          <ShieldCheck size={14} color="var(--color-secondary)" />
          <span>Protected by CTEVT Credential Network</span>
        </div>
      </div>
    </div>
  );
}
