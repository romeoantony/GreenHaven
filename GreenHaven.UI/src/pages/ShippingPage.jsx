import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Clock, Globe } from 'lucide-react';

const ShippingPage = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-10rem)] py-12 px-4 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Shipping & Delivery</h1>
          <p className="text-xl text-gray-600">
            We take extra care to ensure your plants arrive safely and happily.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 p-6 rounded-xl flex gap-4"
          >
            <div className="bg-white p-3 rounded-full h-fit shadow-sm text-primary">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over ₹999. For orders under ₹999, a flat rate of ₹99 applies.</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-6 rounded-xl flex gap-4"
          >
            <div className="bg-white p-3 rounded-full h-fit shadow-sm text-primary">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Secure Packaging</h3>
              <p className="text-gray-600">We use custom-designed, eco-friendly packaging to keep your plants secure during transit.</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-6 rounded-xl flex gap-4"
          >
            <div className="bg-white p-3 rounded-full h-fit shadow-sm text-primary">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Delivery Time</h3>
              <p className="text-gray-600">Orders are processed within 1-2 business days. Delivery typically takes 3-5 business days.</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-xl flex gap-4"
          >
            <div className="bg-white p-3 rounded-full h-fit shadow-sm text-primary">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Nationwide Delivery</h3>
              <p className="text-gray-600">We currently ship to all major cities and pin codes across India.</p>
            </div>
          </motion.div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Shipping Policy</h2>
            <div className="prose text-gray-600 max-w-none">
              <p className="mb-4">
                We ship orders Monday through Wednesday to avoid plants sitting in transit over the weekend. Orders placed after Wednesday 12 PM will be shipped the following Monday.
              </p>
              <p>
                Once your order is shipped, you will receive a tracking number via email. Please ensure someone is available to receive the package to prevent the plants from being exposed to extreme temperatures for too long.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Returns & Replacements</h2>
            <div className="prose text-gray-600 max-w-none">
              <p className="mb-4">
                We guarantee that your plants will arrive in healthy condition. If your plant arrives damaged or unhealthy, please contact us within 24 hours of delivery with photos of the plant and packaging.
              </p>
              <p>
                We will happily offer a replacement or a refund for damaged items. Please note that minor cosmetic damage (like a broken leaf) may occur during shipping and does not affect the plant's health.
              </p>
              <p className="mt-4 font-medium">
                Note: As plants are living perishable items, we do not accept returns for change of mind.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
