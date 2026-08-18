// Shram Setu Admin — Verifier Only Route Guard
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function VerifierRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--color-text-secondary)' }}>
        Verifying permissions...
      </div>
    );
  }

  if (role !== 'verifier' && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
