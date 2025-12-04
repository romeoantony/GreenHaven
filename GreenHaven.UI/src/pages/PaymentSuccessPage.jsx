import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your plants are being prepared for their new home.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
            <p>Order ID: #{Math.floor(Math.random() * 1000000)}</p>
            <p>A confirmation email has been sent to your inbox.</p>
          </div>

          <Link 
            to="/" 
            className="flex items-center justify-center w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors group"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
