import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-primary h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Green Plants" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center text-white p-4 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-wide">
          Bring Nature Home
        </h1>
        <p className="text-lg md:text-xl mb-8 font-light text-accent">
          Curated plants for every space, delivered with care.
        </p>
        <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
          Shop Collection
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
