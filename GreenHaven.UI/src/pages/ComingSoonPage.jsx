import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ComingSoonPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6">Coming Soon</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        We're currently crafting this page to bring you the best experience. Stay tuned for something amazing!
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-highlight transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Shop
      </Link>
    </div>
  );
};

export default ComingSoonPage;
