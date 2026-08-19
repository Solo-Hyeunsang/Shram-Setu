// Shram Setu — OTP Verification Page (Direct ClerkJS Client with Robust Verification)
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useClerk } from '@clerk/react';
import { Button } from '../../components/ui/Button';

export function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const email = searchParams.get('email') || '';
  const mode = searchParams.get('mode') || 'signin';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendTimer, setResendTimer] = useState(45);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const clerk = useClerk();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup_email') {
        let completeSignUp;
        try {
          completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
            code: token,
          });
        } catch (verifyErr) {
          const errCode = verifyErr.errors?.[0]?.code;
          const errMsg = verifyErr.errors?.[0]?.message || '';
          if (errCode === 'verification_already_verified' || errMsg.toLowerCase().includes('already been verified')) {
            console.log('Verification already verified, proceeding...');
            completeSignUp = clerk.client.signUp;
          } else {
            throw verifyErr;
          }
        }

        console.log('SignUp email verify outcome:', completeSignUp);
        const sessionId = completeSignUp?.createdSessionId || clerk.client.signUp?.createdSessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId });
        }
        navigate('/onboarding');
        return;
      } else if (mode === 'signup') {
        let completeSignUp;
        try {
          completeSignUp = await clerk.client.signUp.attemptPhoneNumberVerification({
            code: token,
          });
        } catch (verifyErr) {
          const errCode = verifyErr.errors?.[0]?.code;
          const errMsg = verifyErr.errors?.[0]?.message || '';
          if (errCode === 'verification_already_verified' || errMsg.toLowerCase().includes('already been verified')) {
            completeSignUp = clerk.client.signUp;
          } else {
            throw verifyErr;
          }
        }

        const sessionId = completeSignUp?.createdSessionId || clerk.client.signUp?.createdSessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId });
        }
        navigate('/onboarding');
        return;
      } else if (mode === 'signin_email') {
        const result = await clerk.client.signIn.attemptFirstFactor({
          strategy: 'email_code',
          code: token,
        });

        console.log('SignIn email verify outcome:', result);
        const sessionId = result?.createdSessionId || clerk.client.signIn?.createdSessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId });
        }
        navigate('/onboarding');
        return;
      } else if (mode === 'signin') {
        const result = await clerk.client.signIn.attemptFirstFactor({
          strategy: 'phone_code',
          code: token,
        });

        console.log('SignIn phone verify outcome:', result);
        const sessionId = result?.createdSessionId || clerk.client.signIn?.createdSessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId });
        }
        navigate('/onboarding');
        return;
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        'Invalid verification code. Please check and try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setError(null);
    try {
      if (mode === 'signup_email') {
        await clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      } else if (mode === 'signup') {
        await clerk.client.signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      } else if (mode === 'signin_email') {
        const factor = clerk.client.signIn.supportedFirstFactors?.find((f) => f.strategy === 'email_code');
        if (factor) {
          await clerk.client.signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
        }
      } else if (mode === 'signin') {
        const factor = clerk.client.signIn.supportedFirstFactors?.find((f) => f.strategy === 'phone_code');
        if (factor) {
          await clerk.client.signIn.prepareFirstFactor({ strategy: 'phone_code', phoneNumberId: factor.phoneNumberId });
        }
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.errors?.[0]?.message || 'Could not resend code. Please wait a moment.');
    }
  };

  const identifier = email || phone;

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
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={16} />
          {email ? 'Change Email Address' : 'Change Phone Number'}
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="Shram Setu Logo"
            style={{
              width: '42px',
              height: '42px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
            }}
          />
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
              fontFamily: 'var(--font-display)',
            }}
          >
            Enter Verification Code
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              margin: 0,
              lineHeight: '1.4',
            }}
          >
            We've sent a 6-digit verification code to
            <br />
            <strong style={{ color: 'var(--color-text-primary)' }}>{identifier}</strong>
          </p>
        </div>

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
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '28px',
            }}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--color-primary-700)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  background: '#FFFFFF',
                  outline: 'none',
                  transition: 'all var(--transition-fast)',
                }}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading || otp.join('').length !== 6}
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
              boxShadow: '0 4px 14px rgba(13, 43, 82, 0.28)',
            }}
          >
            Verify & Continue
            <ArrowRight size={16} />
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {resendTimer > 0 ? (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-tertiary)',
                margin: 0,
              }}
            >
              Resend code in <strong>{resendTimer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-600)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
              }}
            >
              <RotateCcw size={14} />
              Resend verification code
            </button>
          )}
        </div>

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
          <span>Secure CTEVT Authentication</span>
        </div>
      </div>
    </div>
  );
}
