// Shram Setu — Role Route (requires specific role)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RoleRoute({ role, children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-secondary)',
      }}>
        Loading...
      </div>
    );
  }

  if (!profile || profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
