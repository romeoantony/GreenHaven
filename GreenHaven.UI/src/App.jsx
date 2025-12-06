import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/useAuthStore';

// Lazy load heavy pages
const ShopPage = React.lazy(() => import('./pages/ShopPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CarePage from './pages/CarePage';
import ShippingPage from './pages/ShippingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';
import AlreadyLoggedIn from './components/AlreadyLoggedIn';
import ChatWidget from './components/ChatWidget';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, token } = useAuthStore();
  
  if (!token) return <Navigate to="/login" />;
  
  // Check if user has Admin role
  // roles can be a string (single role) or array (multiple roles)
  const isAdmin = Array.isArray(user?.roles) 
    ? user.roles.includes('Admin')
    : user?.roles === 'Admin';

  return isAdmin ? children : <Navigate to="/" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/" replace /> : children;
};

// Debug Logger
window.debugLogs = [];
window.log = (msg) => {
  if (!import.meta.env.DEV) return; // Only log in development
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const logMsg = `[${timestamp}] ${msg}`;
  window.debugLogs.push(logMsg);
  console.log(logMsg);
  const el = document.getElementById('debug-log-content');
  if (el) el.innerText = window.debugLogs.join('\n');
};

const DebugOverlay = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.8)',
          color: '#0f0',
          border: '1px solid #0f0',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '400px',
      height: '300px',
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      zIndex: 9999,
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      borderTopRightRadius: '8px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
      fontFamily: 'monospace'
    }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,50,0,0.3)',
        borderTopRightRadius: '8px'
      }}>
        <span style={{ fontWeight: 'bold' }}>Debug Console</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { window.debugLogs = []; if(document.getElementById('debug-log-content')) document.getElementById('debug-log-content').innerText = ''; }}
            style={{ background: 'none', border: 'none', color: '#0f0', cursor: 'pointer', opacity: 0.8 }}
            title="Clear Logs"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: '#0f0', cursor: 'pointer', fontSize: '14px' }}
            title="Minimize"
          >
            ▼
          </button>
        </div>
      </div>
      <div style={{
        overflow: 'auto',
        padding: '10px',
        flex: 1
      }}>
        <pre id="debug-log-content" style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {window.debugLogs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <DebugOverlay />}

      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-background text-text">
          <Toaster position="top-right" />
          <Header />
          <CartDrawer />
          <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
            <AnimatePresence mode="wait">
              <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <PageTransition>
                      <ShopPage />
                    </PageTransition>
                  } />
                  <Route path="/login" element={
                    <PageTransition>
                      <PublicOnlyRoute>
                        <LoginPage />
                      </PublicOnlyRoute>
                    </PageTransition>
                  } />
                  <Route path="/register" element={
                    <PageTransition>
                      <PublicOnlyRoute>
                        <RegisterPage />
                      </PublicOnlyRoute>
                    </PageTransition>
                  } />
                  <Route path="/about" element={
                    <PageTransition>
                      <AboutPage />
                    </PageTransition>
                  } />
                  <Route path="/care" element={
                    <PageTransition>
                      <CarePage />
                    </PageTransition>
                  } />
                  <Route path="/shipping" element={
                    <PageTransition>
                      <ShippingPage />
                    </PageTransition>
                  } />
                  <Route path="/faq" element={
                    <PageTransition>
                      <FAQPage />
                    </PageTransition>
                  } />
                  <Route path="/contact" element={
                    <PageTransition>
                      <ContactPage />
                    </PageTransition>
                  } />
                  <Route path="/privacy" element={
                    <PageTransition>
                      <PrivacyPage />
                    </PageTransition>
                  } />
                  
                  <Route path="/admin" element={
                    <PageTransition>
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    </PageTransition>
                  } />
                  <Route path="/profile" element={
                    <PageTransition>
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    </PageTransition>
                  } />
                  <Route path="/payment" element={
                    <PageTransition>
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    </PageTransition>
                  } />
                  <Route path="/payment-success" element={
                    <PageTransition>
                      <ProtectedRoute>
                        <PaymentSuccessPage />
                      </ProtectedRoute>
                    </PageTransition>
                  } />

                  {/* 404 Route */}
                  <Route path="*" element={
                    <PageTransition>
                      <ErrorPage />
                    </PageTransition>
                  } />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          <ChatWidget />
          <Footer />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
