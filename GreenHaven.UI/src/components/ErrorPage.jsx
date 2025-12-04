import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ 
  title = "Page Not Found", 
  message = "The page you are looking for doesn't exist or has been moved.", 
  showHomeButton = true,
  showRetryButton = false,
  onRetry
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle size={64} className="text-red-500" />
      </div>
      
      <h1 className="text-4xl font-serif font-bold text-primary mb-4">{title}</h1>
      <p className="text-gray-600 text-lg max-w-md mb-8">
        {message}
      </p>

      <div className="flex gap-4">
        {showHomeButton && (
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition-all shadow-md"
          >
            <Home size={20} />
            Go Home
          </button>
        )}
        
        {showRetryButton && (
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-white text-primary border-2 border-primary rounded-full hover:bg-gray-50 transition-all"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
