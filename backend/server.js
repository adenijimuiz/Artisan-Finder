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




// const connectDB = require('./config/database');
// const errorHandler = require('./middleware/errorHandler');

// // Import routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const bookingRoutes = require('./routes/bookings');
// const reviewRoutes = require('./routes/reviews');
// const messageRoutes = require('./routes/messages');
// const paymentRoutes = require('./routes/payments');
// const adminRoutes = require('./routes/admin');

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

//connect to cloudinary
connectCloudinary()

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
app.use('/api/bookings', bookingRouter)

// app.use('/api/reviews', reviewRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use(errorHandler)

// Socket.IO connection handling
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins
  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined`);
    
    // Notify others that user is online
    io.emit('user_online', { userId });
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;
    
    // Save message to database (implement in messageController)
    try {
      const Message = require('./models/Message');
      const message = await Message.create({
        sender: senderId,
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

  // Typing indicator
  socket.on('typing', (data) => {
    const { userId, receiverId } = data;
    io.to(`user_${receiverId}`).emit('user_typing', { userId });
  });

  socket.on('stop_typing', (data) => {
    const { userId, receiverId } = data;
    io.to(`user_${receiverId}`).emit('user_stop_typing', { userId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and remove user from active users
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
  // console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});