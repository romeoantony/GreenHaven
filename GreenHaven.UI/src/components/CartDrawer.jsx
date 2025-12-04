import React from 'react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Minus, Plus } from 'lucide-react';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, toggleCart } = useCartStore();
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    toggleCart();
    navigate('/payment');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary bg-opacity-20 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-primary">Your Cart</h2>
          <button onClick={toggleCart} className="text-gray-400 hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg">Your cart is empty.</p>
              <button onClick={toggleCart} className="mt-4 text-primary font-semibold hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow-sm" />
                  <div className="flex-grow">
                    <h3 className="font-serif font-semibold text-primary text-lg">{item.name}</h3>
                    <p className="text-highlight font-medium">₹{item.price}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      ><Minus size={16} /></button>
                      <span className="font-medium text-gray-700 w-4 text-center">{item.quantity}</span>
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      ><Plus size={16} /></button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-secondary">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium text-gray-600">Total</span>
            <span className="text-2xl font-serif font-bold text-primary">₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-highlight transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
