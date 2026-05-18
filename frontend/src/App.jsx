import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BeneficiaryPage from './pages/BeneficiaryPage';
import VendorPage from './pages/VendorPage';

// Loading screen while checking auth
const AuthLoading = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa'
  }}>
    <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Auto-redirect based on role
const RoleRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'beneficiary': return <Navigate to="/beneficiary" />;
    case 'vendor': return <Navigate to="/vendor" />;
    default: return <Navigate to="/dashboard" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Separate component so useAuth works inside Router
const AppContent = () => {
  const { loading } = useAuth();

  // Show loading while checking auth on initial load
  if (loading) {
    return <AuthLoading />;
  }

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/verify" element={<Donate verifyMode={true} />} />
          <Route path="/login" element={<Login />} />
          
          {/* Auto-redirect after login */}
          <Route path="/portal" element={<RoleRedirect />} />
          
          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Beneficiary */}
          <Route path="/beneficiary" element={
            <ProtectedRoute allowedRoles={['beneficiary']}>
              <BeneficiaryPage />
            </ProtectedRoute>
          } />
          
          {/* Vendor */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorPage />
            </ProtectedRoute>
          } />
          
          {/* Donor/Corporate */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['donor', 'corporate']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/vendors" element={<Vendors />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;