import React from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import PageTransition from './PageTransition';

const Layout = () => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-primary font-sans">
      <CartDrawer />
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {element}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
