import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Features from './components/Features';
import Technology from './components/Technology';
import Find from './components/Find';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import PermissionDialog from './components/PermissionDialog';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import { usePermissions } from './contexts/PermissionsContext';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default function App() {
  const { permissions, loading: permLoading } = usePermissions();
  const [showPermissions, setShowPermissions] = React.useState(false);

  React.useEffect(() => {
    // If permission checking is done and not all granted, show the dialog
    if (!permLoading) {
      const allGranted = Object.values(permissions).every(Boolean);
      setShowPermissions(!allGranted);
    }
  }, [permLoading, permissions]);

  return (
    <div className="app">
      <AccessibilityToolbar />
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <>
              <a className="skip-link" href="#main">Skip to content</a>
              <Header />
              <main id="main" className="landing-page">
                <Hero />
                <Problems />
                <Features />
                <Technology />
                <Find />
                <Footer />
              </main>
              {showPermissions && (
                <PermissionDialog onClose={() => setShowPermissions(false)} />
              )}
            </>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/auth/*"
          element={
            <div className="auth-layout">
              <Header minimal={true} />
              <main id="main" className="auth-pages">
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Routes>
              </main>
            </div>
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="dashboard-layout">
                <Header />
                <main id="main">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}