import './utils/logger.jsx'; // Initialize global logger logic
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/useAuthStore.jsx';

// Lazy load heavy pages
const ShopPage = React.lazy(() => import('./pages/ShopPage.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CarePage from './pages/CarePage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import Header from './components/Header.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import AlreadyLoggedIn from './components/AlreadyLoggedIn.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const queryClient = new QueryClient();

import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './components/AuthRoutes.jsx';
import DebugOverlay from './components/DebugOverlay.jsx';

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
              <Suspense fallback={<LoadingScreen />}>
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
