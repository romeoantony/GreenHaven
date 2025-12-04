import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            Bringing Nature Home
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 leading-relaxed"
          >
            We believe that plants are more than just decor—they're living companions that bring life, joy, and tranquility to your space.
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="GreenHaven Greenhouse" 
              className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-serif font-bold text-primary">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              GreenHaven started as a small passion project in a tiny apartment filled with cuttings and propagation stations. What began as a love for greenery quickly grew into a mission to make plant parenthood accessible to everyone.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we curate the healthiest, happiest plants from sustainable growers and deliver them directly to your doorstep, along with the knowledge and support you need to help them thrive.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Sustainability First</h3>
              <p className="text-gray-600">
                We partner with eco-conscious growers and use sustainable packaging to minimize our environmental footprint.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Plant Health Guarantee</h3>
              <p className="text-gray-600">
                Every plant is inspected before shipping. If your plant doesn't arrive happy and healthy, we'll replace it.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Community & Support</h3>
              <p className="text-gray-600">
                We're here for you long after your purchase with expert care tips and a supportive community of plant lovers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
