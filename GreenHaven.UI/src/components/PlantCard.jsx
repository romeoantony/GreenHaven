import React from 'react';
import useCartStore from '../store/useCartStore';
import { ShoppingBag } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const PlantCard = ({ plant, onClick }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking add to cart
    addToCart(plant);
  };

  return (
    <div 
      onClick={() => onClick && onClick(plant)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="relative overflow-hidden h-72">
        <img
          src={getImageUrl(plant.imageUrl)}
          alt={plant.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-primary p-3 rounded-full shadow-xl translate-y-16 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
        >
          <ShoppingBag size={22} />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-serif font-bold text-primary mb-2">{plant.name}</h3>
        <p className="text-sm text-gray-400 italic mb-4 font-light">{plant.scientificName}</p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xl font-bold text-highlight">₹{plant.price}</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">{plant.category?.name || 'Plant'}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
