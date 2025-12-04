import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditOrderModal = ({ order, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    status: '',
    orderIdentifier: '',
    notes: '',
    items: []
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'Pending',
        orderIdentifier: order.orderIdentifier || '',
        notes: order.notes || '',
        items: order.items ? order.items.map(i => ({ plantId: i.plantId || i.id, quantity: i.quantity, name: i.name || i.plantName, unitPrice: i.unitPrice })) : []
      });
    }
  }, [order]);

  const handleQuantityChange = (index, newQty) => {
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = parseInt(newQty) || 0;
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-primary">Edit Order #{order?.id}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Reference / Customer</label>
            <input
              type="text"
              value={formData.orderIdentifier}
              onChange={(e) => setFormData({ ...formData, orderIdentifier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g. Client Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Add notes about this order..."
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">₹{item.unitPrice} each</span>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Qty:</label>
                      <input 
                        type="number" 
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
               <span className="text-sm text-gray-500">New Total: </span>
               <span className="text-lg font-bold text-primary">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditOrderModal;
