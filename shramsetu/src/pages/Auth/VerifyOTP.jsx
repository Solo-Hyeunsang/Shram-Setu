// Shram Setu — OTP Verification Page (Clean White)
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, ArrowLeft, ShieldCheck } from 'lucide-react';
import { verifyOtp, signInWithPhone } from '../../api/authApi';
import { Button } from '../../components/ui/Button';

export function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendTimer, setResendTimer] = useState(45);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

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
    const { error: verifyError } = await verifyOtp(phone, token);
    setLoading(false);

    navigate('/onboarding');
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setError(null);
    await signInWithPhone(phone);
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
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={16} />
          Change Phone Number
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '6px',
            }}
          >
            Enter Verification Code
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
            We've sent a 6-digit SMS code to{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>{phone || 'your phone'}</strong>
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEE2E2',
              color: 'var(--color-danger)',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '28px',
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '46px',
                  height: '54px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-lg)',
                  border: digit ? '2px solid var(--color-primary-500)' : '1.5px solid var(--color-border)',
                  background: digit ? 'var(--color-primary-50)' : '#FFFFFF',
                  outline: 'none',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                  transition: 'all var(--transition-fast)',
                }}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
          >
            Verify & Continue
            <ArrowRight size={16} />
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {resendTimer > 0 ? (
            <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
              Resend code in <strong style={{ color: 'var(--color-primary-600)' }}>{resendTimer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-500)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RotateCcw size={14} />
              Resend Code
            </button>
          )}
        </div>

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
          Secure verification
        </div>
      </div>
    </div>
  );
}
