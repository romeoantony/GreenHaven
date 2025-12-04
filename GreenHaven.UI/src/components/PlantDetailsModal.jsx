import React, { useState } from 'react';
import { X, ShoppingBag, Sun, Droplets, Sprout, Heart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageUtils';

const PlantDetailsModal = ({ plant, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!plant) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(plant);
    }
    onClose();
  };

  const lightMap = { 0: 'Low', 1: 'Indirect', 2: 'Direct' };
  const difficultyMap = { 0: 'Beginner', 1: 'Intermediate', 2: 'Expert' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" 
        onClick={onClose}
      ></motion.div>

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
      >
        
        {/* Close Button (Mobile) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full md:hidden text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
          <img 
            src={getImageUrl(plant.imageUrl)} 
            alt={plant.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-1">{plant.name}</h2>
              <p className="text-gray-500 italic font-light">{plant.scientificName}</p>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:block text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-highlight">₹{plant.price}</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
              In Stock
            </span>
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {plant.description || "A beautiful addition to your collection. This plant is known for its unique foliage and easy care requirements."}
          </p>

          {/* Care Info Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Sun className="text-primary" size={20} />
              <div>
                <p className="text-xs text-gray-500 uppercase">Light</p>
                <p className="font-medium text-gray-700">{lightMap[plant.lightRequirement] || 'Varied'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Droplets className="text-blue-500" size={20} />
              <div>
                <p className="text-xs text-gray-500 uppercase">Water</p>
                <p className="font-medium text-gray-700">Weekly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Sprout className="text-green-600" size={20} />
              <div>
                <p className="text-xs text-gray-500 uppercase">Difficulty</p>
                <p className="font-medium text-gray-700">{difficultyMap[plant.difficulty] || 'Easy'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Heart className={plant.isPetFriendly ? "text-red-500" : "text-gray-400"} size={20} />
              <div>
                <p className="text-xs text-gray-500 uppercase">Pet Friendly</p>
                <p className="font-medium text-gray-700">{plant.isPetFriendly ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-8 flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button 
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="w-12 text-center font-medium text-gray-700">{quantity}</span>
              <button 
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-grow bg-transparent border-2 border-primary text-primary py-4 px-8 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all shadow-md flex items-center justify-center gap-3"
            >
              <ShoppingBag size={22} />
              Add to Cart
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default PlantDetailsModal;
