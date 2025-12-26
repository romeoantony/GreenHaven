import api from './axios';

export const plantService = {
  getPlants: async (params) => {
    const response = await api.get('/plants', { params });
    return response.data;
  },
  
  getPlant: async (id) => {
    const response = await api.get(`/plants/${id}`);
    return response.data;
  },

  getFeaturedPlants: async () => {
    const response = await api.get('/plants/featured');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/plants/categories');
    return response.data;
  }
};
