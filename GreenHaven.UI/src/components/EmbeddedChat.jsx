import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessageCircle } from 'lucide-react';
import { chatService } from '../api/chatService';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';

const EmbeddedChat = () => {
  const { user, token } = useAuthStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Check if user has Admin role
  const isAdmin = Array.isArray(user?.roles) 
    ? user.roles.includes('Admin')
    : user?.roles === 'Admin';

  const { data: messages = [] } = useQuery({
    queryKey: ['my-messages', token],
    queryFn: chatService.getMyMessages,
    enabled: !!token && !isAdmin,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content) => chatService.sendMessage(content),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries(['my-messages', token]);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      alert('Failed to send message: ' + (error.response?.data || error.message));
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !token) return;
    sendMessageMutation.mutate(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-[500px] flex flex-col items-center justify-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <MessageCircle size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Chat with Support</h3>
        <p className="text-gray-600 mb-6 max-w-xs mx-auto">Please log in to start a conversation with our support team.</p>
        <a href="/login" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors">
          Log In to Chat
        </a>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-[500px] flex flex-col items-center justify-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <MessageCircle size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Admin View</h3>
        <p className="text-gray-600">Admins should use the Dashboard to manage chats.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-primary p-6 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle size={24} /> 
          Live Support
        </h3>
        <p className="text-primary-foreground/80 text-sm mt-1">
          We typically reply within a few minutes.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg font-medium">👋 Hi {user?.fullName || 'there'}!</p>
            <p className="mt-2">How can we help you today?</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.isFromAdmin
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    : 'bg-primary text-white rounded-tr-none shadow-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <span className={`text-[10px] block mt-2 ${msg.isFromAdmin ? 'text-gray-400' : 'text-green-100'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        <button
          type="submit"
          disabled={sendMessageMutation.isPending || !message.trim()}
          className="bg-primary text-white p-3 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default EmbeddedChat;
