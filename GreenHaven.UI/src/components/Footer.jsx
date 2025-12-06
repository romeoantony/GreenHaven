import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-serif font-bold tracking-tight">GreenHaven</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bringing nature into your home with our curated collection of premium indoor plants. We believe in the power of greenery to transform spaces and lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-highlight">Quick Links</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Shop Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/care" className="hover:text-white transition-colors">Plant Care Guide</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-highlight">Support</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-highlight">Get in Touch</h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-highlight" />
                <span>Trivandrum, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-highlight" />
                <span>+91 9999999999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-highlight" />
                <span>support@greenhaven.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GreenHaven. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
