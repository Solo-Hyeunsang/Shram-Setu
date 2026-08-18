// Shram Setu Admin — Top Bar Component
import { LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export function TopBar() {
  const { profile, role, signOut, setDemoUser } = useAuth();

  return (
    <header
      style={{
        height: '64px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Environment: <strong style={{ color: 'var(--color-secondary)' }}>Live Prototype</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick Demo Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--color-background-subtle)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setDemoUser('admin')}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
              background: role === 'admin' ? 'var(--color-primary-500)' : 'transparent',
              color: role === 'admin' ? '#FFFFFF' : 'var(--color-text-secondary)',
            }}
          >
            Admin View
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('verifier')}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
              background: role === 'verifier' ? 'var(--color-primary-500)' : 'transparent',
              color: role === 'verifier' ? '#FFFFFF' : 'var(--color-text-secondary)',
            }}
          >
            CTEVT Verifier
          </button>
        </div>

        {/* User profile info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-100)',
              color: 'var(--color-primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '13px',
            }}
          >
            <User size={16} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: '1.2' }}>
              {profile?.full_name || 'Admin User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
              {profile?.email || 'admin@shramsetu.com'}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          style={{ color: 'var(--color-text-tertiary)', padding: '6px 10px' }}
        >
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}
