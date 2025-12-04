import React from 'react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../store/useUIStore';

const Header = () => {
  const { cart, toggleCart } = useCartStore();
  const { user } = useAuthStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="GreenHaven Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-serif font-bold text-primary tracking-tight group-hover:text-highlight transition-colors">
            GreenHaven
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-text hover:text-primary font-medium transition-colors">Shop</Link>
          <Link to="/about" className="text-text hover:text-primary font-medium transition-colors">Our Story</Link>
          <Link to="/care" className="text-text hover:text-primary font-medium transition-colors">Plant Care</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary hidden md:block">
                {user.fullName || user.email}
              </span>
              <Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">
                <User size={20} />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="text-gray-500 hover:text-primary transition-colors">
              <User size={20} />
            </Link>
          )}
          <button 
            className="relative text-gray-500 hover:text-primary transition-colors group"
            onClick={toggleCart}
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="md:hidden text-gray-500 hover:text-primary transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
