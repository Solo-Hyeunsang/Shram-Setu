import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, profile, user: authUser, signOut } = useAuth();
  const { user: clerkUser, isSignedIn } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const isUserAuthenticated = isSignedIn || !!session || !!authUser || !!profile;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      if (clerk && clerk.signOut) {
        await clerk.signOut();
      }
    } catch (err) {
      console.warn('Clerk sign out:', err);
    }
    if (signOut) {
      await signOut();
    }
    navigate('/');
  };

  const navLinks = [
    { label: 'Find Workers', href: '/search/workers' },
    { label: 'Find Work', href: '/search/jobs' },
    { label: 'How It Works', href: '/#how-it-works' },
  ];

  const dashboardUrl = profile?.role === 'employer' ? '/employer/dashboard' : '/worker/dashboard';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
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
            <img
              src="/logo.png"
              alt="Shram Setu Logo"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
              }}
            />
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
                  e.currentTarget.style.color = 'var(--color-primary-600)';
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
            {isUserAuthenticated ? (
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
                  onClick={() => navigate(dashboardUrl)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-primary-200)',
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-700)',
                    fontWeight: '600',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <User size={15} />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #FECACA',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: '600',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)',
                  }}
                  title="Sign Out"
                >
                  <LogOut size={15} />
                  Logout
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
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                    fontWeight: '600',
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--color-text-primary)',
            }}
            className="mobile-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
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
          {isUserAuthenticated ? (
            <>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setMenuOpen(false);
                  navigate(dashboardUrl);
                }}
              >
                <User size={16} />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                style={{ color: '#DC2626' }}
              >
                <LogOut size={16} />
                Logout
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
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
