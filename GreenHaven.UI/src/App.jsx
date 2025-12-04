import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/useAuthStore';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ComingSoonPage from './pages/ComingSoonPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-text">
        <Header />
        <CartDrawer />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <PageTransition>
                  <ShopPage />
                </PageTransition>
              } />
              <Route path="/login" element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              } />
              <Route path="/register" element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              } />
              <Route path="/about" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              <Route path="/care" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              <Route path="/shipping" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              <Route path="/faq" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              <Route path="/privacy" element={
                <PageTransition>
                  <ComingSoonPage />
                </PageTransition>
              } />
              
              <Route path="/admin" element={
                <PageTransition>
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
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
                  <PaymentPage />
                </PageTransition>
              } />
              <Route path="/payment-success" element={
                <PageTransition>
                  <PaymentSuccessPage />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
