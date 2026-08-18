// Shram Setu — Main Application & Route Configuration
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { Landing } from './pages/Landing/Landing';
import { Login } from './pages/Auth/Login';
import { VerifyOTP } from './pages/Auth/VerifyOTP';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { WorkerSearch } from './pages/Search/WorkerSearch';
import { JobSearch } from './pages/Search/JobSearch';
import { WorkerDashboard } from './pages/Worker/WorkerDashboard';
import { EmployerDashboard } from './pages/Employer/EmployerDashboard';
import { Notifications } from './pages/Notifications/Notifications';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/search/workers" element={<WorkerSearch />} />
          <Route path="/search/jobs" element={<JobSearch />} />

          {/* Protected routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
