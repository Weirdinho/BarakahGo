import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BeneficiaryPage from './pages/BeneficiaryPage';
import VendorPage from './pages/VendorPage';
import About from './pages/About';
import Contact from './pages/Contact';
import DonateGateway from './pages/DonateGateway';
import GuestDonate from './pages/GuestDonate';
import PaymentVerify from './pages/PaymentVerify';
import Press from './pages/Press';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ResetPassword from './pages/ResetPassword';
import Partnerships from './pages/Partnerships'; // ← NEW
import FAQ from './pages/FAQ'; 
import HowItWorksPage from './pages/HowItWorksPage';

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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

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

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  return (
    <div className="app">
      <Navbar />
      <main>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { loading } = useAuth();
  if (loading) return <AuthLoading />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate/verify" element={<Donate verifyMode={true} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portal" element={<RoleRedirect />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/press" element={<Press />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/donateGateway" element={<DonateGateway />} />
        <Route path="/donateGateway/guest" element={<GuestDonate />} />
        <Route path="/donate/verify" element={<PaymentVerify />} />

        <Route path="/partnerships" element={<Partnerships />} /> {/* ← NEW */}
        <Route path="/faq" element={<FAQ />} /> {/* ← NEW */}
         <Route path="/how-it-works" element={<HowItWorksPage />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/:section" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/beneficiary" element={
          <ProtectedRoute allowedRoles={['beneficiary']}>
            <BeneficiaryPage />
          </ProtectedRoute>
        } />
        
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['donor', 'corporate']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors" element={<Vendors />} />
      </Routes>
    </Layout>
  );
};

export default App;