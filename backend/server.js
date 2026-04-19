const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const sanitize = require('mongo-sanitize');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,        // Allow Socket.io connections
  crossOriginEmbedderPolicy: false,     // Allow cross-origin resources
}));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Custom sanitization middleware for Express 5 compatibility
app.use((req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  // req.query is a getter in Express 5, so we sanitize each property individually
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_booking', (bookingId) => {
    socket.join(String(bookingId));  // Ensure string-based room ID
    console.log(`User joined booking room: ${bookingId}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast to the booking room — bookingId must be a string for socket rooms
    io.to(String(data.bookingId)).emit('receive_message', data);
  });

  socket.on('booking_updated', () => {
    io.emit('refresh_bookings');
  });

  socket.on('typing_start', ({ bookingId, senderId }) => {
    socket.to(bookingId).emit('typing_start', { senderId });
  });

  socket.on('typing_stop', ({ bookingId, senderId }) => {
    socket.to(bookingId).emit('typing_stop', { senderId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Simple test route
app.get('/api', (req, res) => {
  res.send('FixIt API is running...');
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server with automatic port conflict resolution
const PORT = process.env.PORT || 5000;

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`\n⚠️  Port ${PORT} is already in use. Freeing it automatically...`);
    const { execSync } = require('child_process');
    try {
      const result = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
      const lines = result.split('\n').filter(l => l.includes('LISTENING'));
      let killed = false;
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          try {
            execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            console.log(`✅ Freed port ${PORT} (killed PID ${pid}). Restarting...`);
            killed = true;
          } catch (_) {}
        }
      });
      if (killed) {
        setTimeout(() => {
          server.removeAllListeners('error');
          server.on('error', (e) => console.error('Server error:', e));
          startServer();
        }, 1200);
      } else {
        console.error(`❌ Could not free port ${PORT}. Please close the process manually.`);
        process.exit(1);
      }
    } catch (e) {
      console.error(`❌ Could not free port ${PORT}:`, e.message);
      process.exit(1);
    }
  } else {
    console.error('Server error:', err);
  }
});

startServer();

