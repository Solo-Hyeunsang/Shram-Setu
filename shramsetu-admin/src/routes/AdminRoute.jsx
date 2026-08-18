// Shram Setu Admin — Admin Only Route Guard
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute({ children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--color-text-secondary)' }}>
        Verifying permissions...
      </div>
    );
  }

  if (role !== 'admin') {
    return <Navigate to="/verifier/queue" replace />;
  }

  return children;
}
