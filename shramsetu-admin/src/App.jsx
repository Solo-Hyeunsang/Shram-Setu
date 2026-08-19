// Shram Setu Admin — Main Application & Route Configuration
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';
import { VerifierRoute } from './routes/VerifierRoute';

import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Admin/Dashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { JobOversight } from './pages/Admin/JobOversight';
import { ContentModeration } from './pages/Admin/ContentModeration';
import { VerificationQueue } from './pages/Verifier/VerificationQueue';
import { RequestDetail } from './pages/Verifier/RequestDetail';
import { AuditTrail } from './pages/Verifier/AuditTrail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin Operations Module */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <JobOversight />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/moderation"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <ContentModeration />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* Verifier Module */}
          <Route
            path="/verifier/queue"
            element={
              <ProtectedRoute>
                <VerifierRoute>
                  <VerificationQueue />
                </VerifierRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verifier/requests/:id"
            element={
              <ProtectedRoute>
                <VerifierRoute>
                  <RequestDetail />
                </VerifierRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verifier/audit"
            element={
              <ProtectedRoute>
                <VerifierRoute>
                  <AuditTrail />
                </VerifierRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
