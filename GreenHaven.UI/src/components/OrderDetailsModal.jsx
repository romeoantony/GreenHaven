import React from 'react';
import { X, Package, Calendar, CreditCard, User } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

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
          <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
            <Package size={24} />
            Order Details #{order.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar size={16} />
                <span className="text-sm">Order Date</span>
              </div>
              <p className="font-medium">{new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CreditCard size={16} />
                <span className="text-sm">Total Amount</span>
              </div>
              <p className="font-medium text-highlight text-lg">₹{order.totalAmount.toFixed(2)}</p>
            </div>
            {order.orderIdentifier && (
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <User size={16} />
                  <span className="text-sm">Order Reference / Customer</span>
                </div>
                <p className="font-medium">{order.orderIdentifier}</p>
              </div>
            )}
            {order.lastUpdated && (
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm">Last Updated</span>
                </div>
                <p className="font-medium">{new Date(order.lastUpdated).toLocaleString()}</p>
              </div>
            )}
            {order.notes && (
              <div className="bg-yellow-50 p-4 rounded-lg md:col-span-2 border border-yellow-100">
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <span className="text-sm font-medium uppercase tracking-wide">Notes</span>
                </div>
                <p className="text-gray-800">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Items</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Product</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">₹{item.unitPrice}</td>
                      <td className="px-4 py-3 text-sm font-medium">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsModal;
