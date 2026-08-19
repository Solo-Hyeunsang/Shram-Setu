// Shram Setu Admin — Sidebar Navigation Component
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  History,
  Building2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Sidebar() {
  const { role, institutionMember } = useAuth();
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Job Oversight', href: '/admin/jobs', icon: Briefcase },
    { label: 'Content Moderation', href: '/admin/moderation', icon: ShieldAlert },
  ];

  const verifierNav = [
    { label: 'Verification Queue', href: '/verifier/queue', icon: ShieldCheck },
    { label: 'Decision Audit Trail', href: '/verifier/audit', icon: History },
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src="/logo.png"
          alt="Shram Setu Logo"
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
            borderRadius: 'var(--radius-md)',
          }}
        />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px', color: 'var(--color-text-primary)' }}>
            Shram Setu
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary-600)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {role === 'verifier' ? 'Verifier Portal' : 'Admin Operations'}
          </div>
        </div>
      </div>

      {/* Nav list */}
      <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
        {/* Admin Module Section */}
        {role === 'admin' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 10px' }}>
              Administration
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {adminNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '13.5px',
                      fontWeight: active ? '600' : '500',
                      color: active ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                      background: active ? 'var(--color-primary-50)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--color-primary-500)' : 'var(--color-text-tertiary)'} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Verifier Module Section */}
        {(role === 'verifier' || role === 'admin') && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 10px' }}>
              CTEVT Verification
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {verifierNav.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '13.5px',
                      fontWeight: active ? '600' : '500',
                      color: active ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                      background: active ? 'var(--color-primary-50)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--color-primary-500)' : 'var(--color-text-tertiary)'} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer / Tenant status */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-background-subtle)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Building2 size={14} color="var(--color-primary-500)" />
          <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {institutionMember?.institutions?.name || 'CTEVT Nepal'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-tertiary)' }}>
          <Lock size={11} />
          Role: {role?.toUpperCase() || 'USER'}
        </div>
      </div>
    </aside>
  );
}
