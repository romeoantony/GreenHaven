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
import ScrollToTop from './components/ScrollToTop';

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

  return isAdmin ? children : <ErrorPage />;
};

const PublicOnlyRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <AlreadyLoggedIn /> : children;
};

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-background text-text">
          <Toaster position="top-right" />
          <ScrollToTop />
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
          <Footer />
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
