import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { Plus, Edit, Trash2, ShoppingBag, Package, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlantForm from '../components/PlantForm';
import OrderDetailsModal from '../components/OrderDetailsModal';
import EditOrderModal from '../components/EditOrderModal';

const AdminDashboard = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [activeTab, setActiveTab] = useState('plants'); // 'plants' or 'orders'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  
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
    },
    onError: (error) => {
      alert('Failed to delete plant: ' + (error.response?.data?.title || error.message));
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
    },
    onError: (error) => {
      alert('Failed to update order: ' + (error.response?.data?.title || error.message));
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

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      deleteMutation.mutate(id);
    }
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

  const sortedPlants = sortData(filteredPlants);
  const sortedOrders = sortData(filteredOrders);

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
              placeholder={activeTab === 'plants' ? "Search plants..." : "Search orders..."}
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
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'plants' ? (
          <motion.div
            key="plants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <button 
                onClick={handleAddClick}
                className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-90 shadow-md transition-all"
              >
                <Plus size={20} /> Add Plant
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <table className="min-w-full divide-y divide-gray-200">
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
              <h2 className="text-xl font-bold mb-4">{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h2>
              <PlantForm 
                initialData={editingPlant}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
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
    </div>
  );
};

export default AdminDashboard;
