import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-10rem)] py-12 px-4 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. We are committed to protecting your personal data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
              <Shield size={24} />
            </div>
            <h3 className="font-bold mb-2">Data Protection</h3>
            <p className="text-sm text-gray-600">We use industry-standard security measures to protect your data.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
              <Lock size={24} />
            </div>
            <h3 className="font-bold mb-2">Secure Payments</h3>
            <p className="text-sm text-gray-600">All transactions are encrypted and processed securely.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
              <Eye size={24} />
            </div>
            <h3 className="font-bold mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">We are transparent about how we collect and use your data.</p>
          </div>
        </div>

        <div className="prose max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us for support. This may include your name, email address, shipping address, phone number, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Process and fulfill your orders.</li>
              <li>Communicate with you about your account and orders.</li>
              <li>Send you marketing communications (if you have opted in).</li>
              <li>Improve our website and customer service.</li>
              <li>Detect and prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">3. Sharing of Information</h2>
            <p>
              We do not sell your personal information to third parties. We may share your information with trusted service providers who help us operate our business, such as payment processors and shipping partners. These providers are obligated to keep your information confidential and secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">4. Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience and analyze website traffic. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about our Privacy Policy, please contact us at <a href="mailto:privacy@greenhaven.com" className="text-primary hover:underline">privacy@greenhaven.com</a>.
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Last updated: December 5, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
