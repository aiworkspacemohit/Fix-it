import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Send, User, CheckCheck } from 'lucide-react';

const Chat = ({ bookingId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Is the OTHER person typing?
  const socket = useSocket();
  const { user } = useAuth();
  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/${bookingId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat');
      }
    };
    if (bookingId) fetchMessages();
  }, [bookingId]);

  const myId = user?.id || user?._id;

  // Socket room join + real-time event listeners
  useEffect(() => {
    if (!socket || !bookingId) return;

    socket.emit('join_booking', String(bookingId));

    const handleReceive = (msg) => {
      // Only add message if it came from the OTHER person
      if (String(msg.senderId) !== String(myId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTypingStart = ({ senderId }) => {
      if (String(senderId) !== String(myId)) setIsTyping(true);
    };

    const handleTypingStop = ({ senderId }) => {
      if (String(senderId) !== String(myId)) setIsTyping(false);
    };

    socket.on('receive_message', handleReceive);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, bookingId, user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Typing indicator emitter with debounce
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket) return;

    socket.emit('typing_start', { bookingId: String(bookingId), senderId: myId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { bookingId: String(bookingId), senderId: myId });
    }, 1500);
  };

  // Memoized send handler
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const messageData = {
      bookingId: String(bookingId),
      senderId: myId,
      receiverId,
      message: input.trim(),
      timestamp: new Date(),
    };

    // Immediately clear typing indicator
    socket.emit('typing_stop', { bookingId: String(bookingId), senderId: myId });
    clearTimeout(typingTimeoutRef.current);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        messageData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setInput('');
    } catch (err) {
      console.error('Message failed to send');
    }
  }, [input, socket, bookingId, user, receiverId]);

  return (
    <div className="card chat-interface-ui">
      {/* Header */}
      <div className="chat-header-ui">
        <div className="chat-avatar-ui">
          <User size={20} />
        </div>
        <div className="chat-status-ui">
          <span className="name">Message Box</span>
          <span className="status">
            <div className="online-dot"></div> Live Session
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="chat-messages-area-ui">
        {messages.length === 0 && (
          <div className="chat-empty-ui">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg-wrapper-ui ${String(msg.senderId) === String(myId) ? 'sent' : 'received'}`}
          >
            <div className="msg-bubble-ui">
              <p>{msg.message}</p>
              <div className="msg-meta-ui">
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {String(msg.senderId) === String(myId) && <CheckCheck size={14} />}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="msg-wrapper-ui received">
            <div className="msg-bubble-ui typing-bubble-ui">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSendMessage} className="chat-input-row-ui">
        <input
          type="text"
          placeholder="Type a message..."
          className="input-field"
          style={{ borderRadius: '999px' }}
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
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
          padding: 20px 28px;
          background: #FAFAFA;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .chat-avatar-ui {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,122,0,0.1); color: var(--primary-accent);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chat-status-ui { display: flex; flex-direction: column; }
        .chat-status-ui .name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .chat-status-ui .status { font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; }
        .online-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }

        .chat-messages-area-ui {
          flex: 1; padding: 24px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 16px;
          background: #FAFAFA;
        }
        .chat-empty-ui { text-align: center; padding: 40px; color: var(--text-secondary); font-size: 0.95rem; }

        .msg-wrapper-ui { display: flex; width: 100%; }
        .msg-wrapper-ui.sent { justify-content: flex-end; }
        .msg-wrapper-ui.received { justify-content: flex-start; }

        .msg-bubble-ui {
          max-width: 78%; padding: 12px 18px;
          border-radius: 20px; position: relative;
        }
        .sent .msg-bubble-ui {
          background: var(--primary-accent); color: white;
          border-bottom-right-radius: 4px;
        }
        .received .msg-bubble-ui {
          background: #F0F0F0; color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }
        .msg-meta-ui {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 4px; font-size: 0.65rem; margin-top: 4px; opacity: 0.75;
        }

        /* Typing indicator */
        .typing-bubble-ui { padding: 14px 18px; }
        .typing-dots { display: flex; gap: 5px; align-items: center; }
        .typing-dots span {
          width: 8px; height: 8px; background: #999;
          border-radius: 50%; display: block;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .chat-input-row-ui {
          padding: 16px 20px; background: white;
          border-top: 1px solid var(--border-light);
          display: flex; gap: 10px; flex-shrink: 0;
        }
        .chat-send-btn {
          width: 48px; height: 48px; background: var(--primary-accent); color: white;
          border: none; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-send-btn:not(:disabled):hover { transform: scale(1.08); }

        @media (max-width: 768px) {
          .chat-interface-ui { height: 450px; }
          .chat-messages-area-ui { padding: 16px; }
          .chat-input-row-ui { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
};

export default Chat;
