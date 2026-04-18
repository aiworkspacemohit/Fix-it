import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Send, User, Clock, CheckCheck } from 'lucide-react';

const Chat = ({ bookingId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = useSocket();
  const { user } = useAuth();
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/chat/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat');
      }
    };
    fetchMessages();
  }, [bookingId]);

  useEffect(() => {
    if (socket) {
      socket.emit('join_booking', bookingId);
      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => socket?.off('receive_message');
  }, [socket, bookingId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const messageData = {
      bookingId,
      senderId: user.id,
      receiverId,
      message: input,
      timestamp: new Date()
    };

    try {
      await axios.post('http://localhost:5000/api/chat', messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setInput('');
    } catch (err) {
      console.error('Message failed');
    }
  };

  return (
    <div className="card chat-interface-ui">
      <div className="chat-header-ui">
        <div className="chat-avatar-ui">
           <User size={20} />
        </div>
        <div className="chat-status-ui">
           <span className="name">Direct Liaison Thread</span>
           <span className="status"><div className="online-dot"></div> Active Session</span>
        </div>
      </div>

      <div className="chat-messages-area-ui">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-wrapper-ui ${msg.senderId === user.id ? 'sent' : 'received'}`}>
            <div className="msg-bubble-ui">
              <p>{msg.message}</p>
              <div className="msg-meta-ui">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.senderId === user.id && <CheckCheck size={14} />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-row-ui">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="input-field"
          style={{borderRadius: '999px'}}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="chat-send-btn">
          <Send size={20} />
        </button>
      </form>

      <style jsx>{`
        .chat-interface-ui {
          height: 600px;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          background: white;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-main);
        }
        .chat-header-ui {
          padding: 24px 32px;
          background: #FAFAFA;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .chat-avatar-ui {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 122, 0, 0.1);
          color: var(--primary-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-status-ui { display: flex; flex-direction: column; }
        .chat-status-ui .name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .chat-status-ui .status { font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
        .online-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
        
        .chat-messages-area-ui {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #FFFFFF;
        }
        .msg-wrapper-ui { display: flex; width: 100%; }
        .msg-wrapper-ui.sent { justify-content: flex-end; }
        .msg-wrapper-ui.received { justify-content: flex-start; }
        
        .msg-bubble-ui {
          max-width: 80%;
          padding: 14px 20px;
          border-radius: 20px;
          position: relative;
        }
        .sent .msg-bubble-ui {
          background: var(--primary-accent);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .received .msg-bubble-ui {
          background: var(--input-bg);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }
        
        .msg-meta-ui {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          font-size: 0.65rem;
          margin-top: 6px;
          opacity: 0.8;
        }
        
        .chat-input-row-ui {
          padding: 20px 24px;
          background: white;
          border-top: 1px solid var(--border-light);
          display: flex;
          gap: 12px;
        }
        .chat-send-btn {
          width: 52px;
          height: 52px;
          background: var(--primary-accent);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .chat-send-btn:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

export default Chat;
