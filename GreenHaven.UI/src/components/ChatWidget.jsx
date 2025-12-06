import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { chatService } from '../api/chatService';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const ChatContent = ({ isOpen, setIsOpen, user, token }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['my-messages', token], // Include token in queryKey
    queryFn: chatService.getMyMessages,
    enabled: isOpen && !!token,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content) => {
      if (window.log) window.log(`ChatWidget: Sending message: ${content}`);
      return chatService.sendMessage(content);
    },
    onSuccess: () => {
      if (window.log) window.log('ChatWidget: Message sent successfully');
      setMessage('');
      queryClient.invalidateQueries(['my-messages', token]);
    },
    onError: (error) => {
      if (window.log) window.log(`ChatWidget: Error sending message: ${error.message}`);
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!token) return null; // Render nothing inside ChatContent if no token

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-gray-200 flex flex-col h-[500px]"
        >
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle size={20} /> Support Chat
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>👋 Hi {user?.fullName || 'there'}!</p>
                <p className="text-sm mt-2">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.isFromAdmin
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        : 'bg-primary text-white rounded-tr-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-[10px] block mt-1 ${msg.isFromAdmin ? 'text-gray-400' : 'text-green-100'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={sendMessageMutation.isPending || !message.trim()}
              className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChatWidget = () => {
  const { user, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Check if user has Admin role
  const isAdmin = Array.isArray(user?.roles) 
    ? user.roles.includes('Admin')
    : user?.roles === 'Admin';

  // Do not render for admins or unauthenticated users
  if (!token || isAdmin) return null;

  // We always render ChatContent, but pass token to it.
  // ChatContent will decide whether to run hooks and render UI based on token and isOpen.
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <ChatContent isOpen={isOpen} setIsOpen={setIsOpen} user={user} token={token} />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-colors flex items-center justify-center mt-4"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;