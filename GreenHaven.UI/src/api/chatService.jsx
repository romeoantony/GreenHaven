import api from './axios';

export const chatService = {
  // Send a message
  sendMessage: async (content, receiverId = null) => {
    const response = await api.post('/messages', { content, receiverId });
    return response.data;
  },

  // Get current user's messages
  getMyMessages: async () => {
    const response = await api.get('/messages/my');
    return response.data;
  },

  // Get all conversations (Admin only)
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // Get specific conversation (Admin only)
  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversations/${userId}`);
    return response.data;
  }
};
