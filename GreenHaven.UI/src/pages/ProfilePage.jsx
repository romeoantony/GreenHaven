import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { User, Mail, Lock, LogOut, Save, AlertCircle, CheckCircle, Package, Eye } from 'lucide-react';
import OrderDetailsModal from '../components/OrderDetailsModal';

const ProfilePage = () => {
  const { user, token, setToken, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put(
        '/auth/profile',
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setToken(response.data.token); // Update token with new claims
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: Array.isArray(error.response?.data) 
          ? error.response.data[0].description 
          : (error.response?.data?.title || error.message || 'Failed to update profile.')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post(
        '/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.title || 'Failed to change password.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedOrder(response.data);
      setIsOrderDetailsOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif">My Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Info Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-primary">
            <User size={24} />
            Personal Information
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} />
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-primary">
            <Lock size={24} />
            Security
          </h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-secondary text-primary font-medium py-2 rounded-lg hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Lock size={18} />
              Change Password
            </button>
          </form>
        </div>
      </div>

      {/* Order History Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-primary">
          <Package size={24} />
          Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-medium text-gray-500">Order ID</th>
                  <th className="pb-4 font-medium text-gray-500">Date</th>
                  <th className="pb-4 font-medium text-gray-500">Items</th>
                  <th className="pb-4 font-medium text-gray-500">Total</th>
                  <th className="pb-4 font-medium text-gray-500">Status</th>
                  <th className="pb-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-primary">#{order.id}</td>
                    <td className="py-4 text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-600">{order.itemCount} items</td>
                    <td className="py-4 font-medium">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="text-primary hover:text-highlight transition-colors"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isOrderDetailsOpen && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setIsOrderDetailsOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
