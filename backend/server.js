import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import connectDB from './config/connectDB.js'
import connectCloudinary from './config/cloudinary.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import adminRouter from './routes/adminRouter.js';
import messageRouter from './routes/messageRouter.js';
import Message from './models/Message.js';
import jwt from 'jsonwebtoken';

// Initialize express
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter);
app.use('/api/messages', messageRouter);

// app.use('/api/messages', messageRoutes);
// app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Socket.IO connection handling
const activeUsers = new Map();

// JWT auth middleware for sockets
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.userId = decoded.id; // ✅ Attach verified user ID to socket
    next();
  });
});


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // ✅ Fix 3: Listen on the string 'join', not socket.userId (a variable value)
  // The user ID is already on socket.userId from the JWT middleware — no need to trust the client
  socket.on('join', () => {
    const userId = socket.userId;
    activeUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined`);

    // Notify others that user is online
    io.emit('user_online', { userId });
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    const { receiverId, content } = data;

    try {
      // ✅ Fix 4: Use socket.userId (from verified JWT) instead of trusting client-sent senderId
      const message = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        content,
        timestamp: new Date()
      });

      // Send to receiver if online
      io.to(`user_${receiverId}`).emit('new_message', {
        ...message.toObject(),
        _id: message._id.toString()
      });

      // Confirm to sender
      socket.emit('message_sent', {
        ...message.toObject(),
        _id: message._id.toString()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing', (data) => {
    const { receiverId } = data;
    io.to(`user_${receiverId}`).emit('user_typing', { userId: socket.userId });
  });

  socket.on('stop_typing', (data) => {
    const { receiverId } = data;
    io.to(`user_${receiverId}`).emit('user_stop_typing', { userId: socket.userId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('user_offline', { userId });
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});