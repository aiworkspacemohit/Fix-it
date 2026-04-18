import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Send, User } from 'lucide-react';

const Chat = ({ bookingId, receiverId }) => {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/chat/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(data);
      } catch (err) {
        console.error('Chat history error');
      }
    };

    if (bookingId) {
      fetchHistory();
      if (socket) {
        socket.emit('join_booking', bookingId);
        socket.on('receive_message', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      }
    }

    return () => {
      if (socket) socket.off('receive_message');
    };
  }, [bookingId, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      bookingId,
      senderId: user.id,
      receiverId,
      text: input
    };

    socket.emit('send_message', msgData);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-white p-4 border-b border-gray-100 flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded-full">
           <User className="h-5 w-5 text-primary" />
        </div>
        <span className="font-bold text-gray-800">Support Chat</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.senderId.toString() === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
              m.senderId.toString() === user.id 
              ? 'bg-primary text-white rounded-tr-none' 
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="p-2 bg-primary text-white rounded-xl hover:bg-orange-600 transition">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
