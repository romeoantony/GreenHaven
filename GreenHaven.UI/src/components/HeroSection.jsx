import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-primary h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Green Plants" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 text-center text-white p-4 max-w-4xl">
        <h1 className="text-7xl md:text-8xl font-serif font-bold mb-6 tracking-tight leading-none text-accent">
          GreenHaven
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light text-accent/90 max-w-2xl mx-auto">
          Curated plants for every space, delivered with care
        </p>
        <button 
          onClick={() => document.getElementById('shop-collection')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-transparent text-accent border-2 border-accent px-10 py-4 rounded-full font-semibold text-lg hover:bg-accent hover:text-primary transition-all duration-300 shadow-lg"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
