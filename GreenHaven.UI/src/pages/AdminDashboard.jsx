import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Plus, Edit, Trash2, ShoppingBag, Package, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, MessageCircle, Send } from 'lucide-react';
import { chatService } from '../api/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import PlantForm from '../components/PlantForm';
import OrderDetailsModal from '../components/OrderDetailsModal';
import EditOrderModal from '../components/EditOrderModal';
import UserForm from '../components/UserForm';

const AdminDashboard = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('plants'); // 'plants', 'orders', or 'users'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  
  // Messaging State
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Fetch Plants
  const { data: plants } = useQuery({
    queryKey: ['plants'],
    queryFn: async () => {
      const response = await api.get('/plants');
      return response.data;
    },
  });

  // Fetch Orders
  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: activeTab === 'orders'
  });

  // Fetch Users
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: activeTab === 'users'
  });

  // Fetch Conversations
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    enabled: activeTab === 'messages',
    refetchInterval: 5000,
  });

  // Fetch Selected Conversation Messages
  const { data: conversationMessages = [] } = useQuery({
    queryKey: ['conversation', selectedConversation?.userId],
    queryFn: () => chatService.getConversation(selectedConversation.userId),
    enabled: !!selectedConversation,
    refetchInterval: 3000,
  });

  // Send Reply Mutation
  const replyMutation = useMutation({
    mutationFn: (content) => chatService.sendMessage(content, selectedConversation.userId),
    onSuccess: () => {
      setReplyMessage('');
      queryClient.invalidateQueries(['conversation', selectedConversation?.userId]);
      queryClient.invalidateQueries(['conversations']);
    },
  });

  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages, selectedConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    replyMutation.mutate(replyMessage);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newPlant) => {
      await api.post('/plants', newPlant, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['plants']);
      setIsModalOpen(false);
      setEditingPlant(null);
    },
    onError: (error) => {
      alert('Failed to create plant: ' + (error.response?.data?.title || error.message));
    }
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPlant) => {
      await api.put(`/plants/${editingPlant.id}`, updatedPlant, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['plants']);
      setIsModalOpen(false);
      setEditingPlant(null);
    },
    onError: (error) => {
      alert('Failed to update plant: ' + (error.response?.data?.title || error.message));
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['plants']);
      toast.success('Plant deleted successfully');
    },
    onError: (error) => {
      const msg = 'Failed to delete plant: ' + (error.response?.data?.title || error.message);
      alert(msg);
      toast.error(msg);
    }
  });

  // Update Order Mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (updatedOrder) => {
      await api.put(`/orders/${selectedOrder.id}`, updatedOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
      setIsEditOrderOpen(false);
      setSelectedOrder(null);
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      const msg = 'Failed to update order: ' + (error.response?.data?.title || error.message);
      alert(msg);
      toast.error(msg);
    }
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser) => {
      await api.put(`/users/${editingUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsModalOpen(false);
      setEditingUser(null);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      const msg = 'Failed to update user: ' + (error.response?.data?.title || error.message);
      alert(msg);
      toast.error(msg);
    }
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      let msg = 'Failed to delete user.';
      
      if (error.response) {
        if (error.response.status === 404) {
          msg = 'User not found or already deleted.';
        } else if (typeof error.response.data === 'string') {
          msg = error.response.data;
        } else if (error.response.data?.title) {
          msg = error.response.data.title;
        }
      } else {
        msg = error.message;
      }
      
      toast.error(msg);
    }
  });

  const handleAddClick = () => {
    setEditingPlant(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (plant) => {
    setEditingPlant(plant);
    setIsModalOpen(true);
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, type: null, id: null });

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ isOpen: true, type: 'plant', id });
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUserClick = (id) => {
    setDeleteConfirmation({ isOpen: true, type: 'user', id });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.type === 'plant') {
      deleteMutation.mutate(deleteConfirmation.id);
    } else if (deleteConfirmation.type === 'user') {
      deleteUserMutation.mutate(deleteConfirmation.id);
    }
    setDeleteConfirmation({ isOpen: false, type: null, id: null });
  };

  const handleViewOrder = (order) => {
    fetchOrderDetails(order.id).then(details => {
      if (details) {
        setSelectedOrder(details);
        setIsOrderDetailsOpen(true);
      }
    });
  };

  const handleEditOrder = (order) => {
    fetchOrderDetails(order.id).then(details => {
      if (details) {
        setSelectedOrder(details);
        setIsEditOrderOpen(true);
      }
    });
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await api.get(`/orders/any/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order details", error);
      alert("Failed to fetch order details. Please try again.");
      return null;
    }
  };

  const handleOrderUpdate = (data) => {
    updateOrderMutation.mutate(data);
  };

  const handleFormSubmit = (data) => {
    if (editingPlant) {
      updateMutation.mutate(data);
    } else if (editingUser) {
      updateUserMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Sorting Logic
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data) => {
    if (!sortConfig.key || !data) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nulls
      if (aValue === null) aValue = '';
      if (bValue === null) bValue = '';

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filtering Logic
  const filteredPlants = Array.isArray(plants) ? plants.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    (order.orderIdentifier && order.orderIdentifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.userEmail && order.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const sortedPlants = sortData(filteredPlants);
  const sortedOrders = sortData(filteredOrders);
  const sortedUsers = sortData(filteredUsers);

  const SortHeader = ({ label, column }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === column ? (
          sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />
        ) : (
          <ArrowUpDown size={14} className="text-gray-300" />
        )}
      </div>
    </th>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === 'plants' ? "Search plants..." : activeTab === 'orders' ? "Search orders..." : "Search users..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('plants'); setSearchTerm(''); setSortConfig({ key: null, direction: 'ascending' }); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'plants' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Plants
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setSearchTerm(''); setSortConfig({ key: null, direction: 'ascending' }); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Orders
            </button>
            <button
              onClick={() => { setActiveTab('users'); setSearchTerm(''); setSortConfig({ key: null, direction: 'ascending' }); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Users
            </button>
            <button
              onClick={() => { setActiveTab('messages'); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'messages' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Messages
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'plants' && (
          <motion.div
            key="plants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={handleAddClick}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 shadow-md transition-all text-sm md:text-base"
              >
                <Plus size={20} /> <span className="hidden sm:inline">Add Plant</span><span className="sm:hidden">Add</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <SortHeader label="Name" column="name" />
                      <SortHeader label="Price" column="price" />
                      <SortHeader label="Stock" column="stockQuantity" />
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPlants?.map((plant) => (
                      <tr key={plant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={plant.imageUrl} alt={plant.name} className="h-10 w-10 rounded-full object-cover" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plant.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{plant.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plant.stockQuantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                          <button 
                            onClick={() => handleEditClick(plant)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(plant.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sortedPlants?.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No plants found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {sortedPlants?.map((plant) => (
                    <div key={plant.id} className="p-4 flex items-center gap-4">
                      <img src={plant.imageUrl} alt={plant.name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{plant.name}</h3>
                        <p className="text-sm text-gray-500">₹{plant.price}</p>
                        <p className="text-xs text-gray-400 mt-1">Stock: {plant.stockQuantity}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleEditClick(plant)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(plant.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {sortedPlants?.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No plants found matching your search.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <SortHeader label="Order ID" column="id" />
                    <SortHeader label="Date" column="orderDate" />
                    <SortHeader label="Customer / Ref" column="orderIdentifier" />
                    <SortHeader label="Items" column="itemCount" />
                    <SortHeader label="Total" column="totalAmount" />
                    <SortHeader label="Status" column="status" />
                    <SortHeader label="Last Updated" column="lastUpdated" />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders?.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.orderIdentifier || 'N/A'}</span>
                          <span className="text-xs text-gray-500">{order.userEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemCount} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-highlight">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.lastUpdated ? new Date(order.lastUpdated).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Order"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sortedOrders?.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No orders found matching your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {sortedOrders?.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-primary">#{order.id}</span>
                        <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                         <span className="font-medium text-gray-900">{order.orderIdentifier || 'N/A'}</span>
                         <span className="text-xs text-gray-500">{order.userEmail}</span>
                      </div>
                      <span className="font-bold text-highlight">₹{order.totalAmount}</span>
                    </div>

                    <div className="flex gap-2 mt-2">
                       <button 
                          onClick={() => handleViewOrder(order)}
                          className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex justify-center items-center gap-2 text-sm font-medium"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="flex-1 py-2 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 flex justify-center items-center gap-2 text-sm font-medium"
                        >
                          <Edit size={16} /> Edit
                        </button>
                    </div>
                  </div>
                ))}
                {sortedOrders?.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No orders found matching your search.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <SortHeader label="Full Name" column="fullName" />
                    <SortHeader label="Email" column="email" />
                    <SortHeader label="Username" column="userName" />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.roles && user.roles.includes('Admin') ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.roles && user.roles.includes('Admin') ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button 
                          onClick={() => handleEditUserClick(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUserClick(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sortedUsers?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found matching your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {sortedUsers?.map((user) => (
                  <div key={user.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-900">{user.fullName}</span>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{user.userName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.roles && user.roles.includes('Admin') ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.roles && user.roles.includes('Admin') ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                       <button 
                          onClick={() => handleEditUserClick(user)}
                          className="flex-1 py-2 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 flex justify-center items-center gap-2 text-sm font-medium"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUserClick(user.id)}
                          className="flex-1 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 flex justify-center items-center gap-2 text-sm font-medium"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                    </div>
                  </div>
                ))}
                {sortedUsers?.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No users found matching your search.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden h-[600px] flex"
          >
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Conversations</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No conversations yet.</div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.userId === conv.userId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-900 truncate">{conv.userName}</span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(conv.lastMessageTime).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {selectedConversation ? (
                <>
                  <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
                    <h3 className="font-bold text-gray-800">{selectedConversation.userName}</h3>
                    <span className="text-xs text-gray-500">User ID: {selectedConversation.userId}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm ${
                            msg.isFromAdmin
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className={`text-[10px] block mt-1 ${msg.isFromAdmin ? 'text-green-100' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type a reply..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={replyMutation.isPending || !replyMessage.trim()}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={18} /> Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                  <MessageCircle size={48} className="mb-4 opacity-20" />
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {editingPlant ? 'Edit Plant' : editingUser ? 'Edit User' : 'Add New Plant'}
              </h2>
              {editingUser ? (
                <UserForm
                  initialData={editingUser}
                  onSubmit={handleFormSubmit}
                  onCancel={() => { setIsModalOpen(false); setEditingUser(null); }}
                  isLoading={updateUserMutation.isPending}
                />
              ) : (
                <PlantForm 
                  initialData={editingPlant}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsModalOpen(false)}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrderDetailsOpen && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setIsOrderDetailsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOrderOpen && (
          <EditOrderModal 
            order={selectedOrder} 
            onSubmit={handleOrderUpdate}
            onCancel={() => setIsEditOrderOpen(false)}
            isLoading={updateOrderMutation.isPending}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmation.isOpen && (
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
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {deleteConfirmation.type}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirmation({ isOpen: false, type: null, id: null })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
