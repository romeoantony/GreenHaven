import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Droplets, Sprout, Thermometer, Wind, Bug } from 'lucide-react';

const CarePage = () => {
  const careTips = [
    {
      icon: <Sun size={32} className="text-yellow-500" />,
      title: "Light Requirements",
      description: "Most indoor plants prefer bright, indirect light. Direct sunlight can scorch leaves, while too little light can stunt growth. Rotate your plants occasionally for even growth."
    },
    {
      icon: <Droplets size={32} className="text-blue-500" />,
      title: "Watering Wisdom",
      description: "Overwatering is the #1 killer of houseplants. Always check the soil moisture before watering. If the top inch is dry, it's usually time to water. Ensure pots have drainage holes."
    },
    {
      icon: <Sprout size={32} className="text-green-600" />,
      title: "Soil & Fertilizer",
      description: "Use a well-draining potting mix. Feed your plants with a balanced liquid fertilizer during the growing season (spring and summer) to support new growth."
    },
    {
      icon: <Thermometer size={32} className="text-red-500" />,
      title: "Temperature & Humidity",
      description: "Most tropical plants thrive in temperatures between 65°F-80°F (18°C-27°C). They also love humidity—mist them regularly or use a pebble tray."
    },
    {
      icon: <Wind size={32} className="text-gray-400" />,
      title: "Air Circulation",
      description: "Good airflow prevents fungal diseases and strengthens stems. Avoid placing plants directly in front of AC vents or drafty windows."
    },
    {
      icon: <Bug size={32} className="text-orange-500" />,
      title: "Pest Control",
      description: "Inspect leaves regularly for pests like spider mites or aphids. Wipe leaves with a damp cloth to keep them clean and dust-free for better photosynthesis."
    }
  ];

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Plant Care Guide</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Keep your green friends happy and healthy with our essential care tips.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Need Specific Advice?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Every plant is unique. Check the specific care instructions on each plant's product page or contact our team for personalized help.
            </p>
            <a href="/contact" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </a>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default CarePage;
