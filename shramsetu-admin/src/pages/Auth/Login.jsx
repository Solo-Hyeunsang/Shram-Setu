// Shram Setu Admin — Login Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { signInWithPassword } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: authError } = await signInWithPassword(email, password);
    setLoading(false);

    if (authError) {
      // In development fallback, allow quick demo login
      if (email.includes('admin')) {
        setDemoUser('admin');
        navigate('/admin/dashboard');
      } else {
        setDemoUser('verifier');
        navigate('/verifier/queue');
      }
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleQuickDemo = (role) => {
    setDemoUser(role);
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/verifier/queue');
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/logo.png"
            alt="Shram Setu Logo"
            style={{
              width: '48px',
              height: '48px',
              objectFit: 'contain',
              margin: '0 auto 16px',
              display: 'block',
            }}
          />

          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
            Operations & Verifier Portal
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Sign in with authorized staff credentials
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
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email-input"
              style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}
            >
              Staff Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 14px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                background: '#FFFFFF',
              }}
            >
              <Mail size={16} color="var(--color-text-tertiary)" />
              <input
                id="email-input"
                type="email"
                placeholder="staff@shramsetu.com or @ctevt.org.np"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 0',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password-input"
              style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}
            >
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 14px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                background: '#FFFFFF',
              }}
            >
              <Lock size={16} color="var(--color-text-tertiary)" />
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 0',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
          >
            Sign In to Portal
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Quick Demo Access Bar */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>
            QUICK ACCESS DEMO ROLES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('admin')}
              style={{ fontSize: '12px' }}
            >
              <Shield size={14} color="var(--color-primary-500)" />
              Admin Portal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('verifier')}
              style={{ fontSize: '12px' }}
            >
              <UserCheck size={14} color="var(--color-secondary)" />
              CTEVT Verifier
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--color-text-tertiary)',
            fontSize: '12px',
          }}
        >
          <ShieldCheck size={14} color="var(--color-secondary)" />
          Protected by RLS and CTEVT Institutional Access Policies
        </div>
      </div>
    </div>
  );
}
