// Shram Setu — Header Component (Clean White UI)
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Find Workers', href: '/search/workers' },
    { label: 'Find Work', href: '/search/jobs' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
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
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  fontSize: '19px',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Shram Setu
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  fontSize: '14.5px',
                  fontWeight: '500',
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

          {/* Desktop User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            {session ? (
              <>
                <button
                  onClick={() => navigate('/notifications')}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={18} color="var(--color-text-secondary)" />
                </button>
                <button
                  onClick={() => navigate(profile?.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard')}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(50, 140, 189, 0.25)',
                  }}
                  aria-label="Dashboard"
                >
                  <User size={18} />
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={20} color="var(--color-text-primary)" />
            ) : (
              <Menu size={20} color="var(--color-text-primary)" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          zIndex: 1001,
          background: '#FFFFFF',
          boxShadow: 'var(--shadow-xl)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--transition-slow)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Close menu"
          >
            <X size={18} color="var(--color-text-secondary)" />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-50)';
                e.currentTarget.style.color = 'var(--color-primary-600)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {session ? (
            <>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setMenuOpen(false);
                  navigate(profile?.role === 'worker' ? '/worker/dashboard' : '/employer/dashboard');
                }}
              >
                <User size={16} />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/login');
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/login');
                }}
              >
                Log In
              </Button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
