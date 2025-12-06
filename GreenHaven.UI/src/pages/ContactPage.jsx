import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import EmbeddedChat from '../components/EmbeddedChat';

const ContactPage = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-10rem)] py-12 px-4 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Our team is always here to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-primary shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">support@greenhaven.com</p>
                    <p className="text-gray-600">hello@greenhaven.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-primary shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 9999999999</p>
                    <p className="text-gray-600">Mon-Fri from 9am to 6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full text-primary shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office</h3>
                    <p className="text-gray-600">Trivandrum, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary p-8 rounded-2xl text-white">
              <h2 className="text-2xl font-bold mb-4">Join our Community</h2>
              <p className="opacity-90 mb-6">
                Follow us on social media for daily plant inspiration, care tips, and exclusive offers.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Chat Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
             <EmbeddedChat />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
