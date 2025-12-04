import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, LogOut, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AlreadyLoggedIn = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="text-green-600" size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-primary mb-3">
          You're Already Logged In
        </h1>
        
        <p className="text-gray-600 mb-2">
          Welcome back, <span className="font-semibold text-primary">{user?.fullName || user?.email}</span>!
        </p>
        
        <p className="text-gray-500 text-sm mb-8">
          You're currently signed in. Choose an action below or log out to switch accounts.
        </p>

        <div className="space-y-3">
          <Link
            to="/profile"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            <User size={20} />
            Go to My Profile
          </Link>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-accent text-primary px-6 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-all"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 px-6 py-3 rounded-full font-medium border border-gray-200 hover:border-red-300 transition-all"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
