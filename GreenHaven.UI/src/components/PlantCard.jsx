import React from 'react';
import useCartStore from '../store/useCartStore';
import { ShoppingBag } from 'lucide-react';

const PlantCard = ({ plant, onClick }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking add to cart
    addToCart(plant);
  };

  return (
    <div 
      onClick={() => onClick && onClick(plant)}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-primary p-3 rounded-full shadow-lg translate-y-12 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif font-bold text-primary mb-1">{plant.name}</h3>
        <p className="text-sm text-gray-500 italic mb-3 font-light">{plant.scientificName}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-highlight">₹{plant.price}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{plant.category?.name || 'Plant'}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
