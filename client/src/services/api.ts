import axios from 'axios';
import { Socket, io } from 'socket.io-client';

// API Base URL
const API_URL    = import.meta.env.VITE_API_URL    || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Axios instance
const api = axios.create({ baseURL: API_URL });

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ─── Socket.IO ────────────────────────────────────────────────────────────────
let socket: Socket | null = null;

export const connectSocket = (_userId: string) => {
  // _userId kept in signature for backward compat but userId comes from JWT on server
  if (socket?.connected) return socket;

  const token = localStorage.getItem('token');

  socket = io(SOCKET_URL, {
    auth: { token },           // ✅ server's io.use() middleware reads this
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    socket?.emit('join');      // ✅ triggers server's socket.on('join') handler
  });

  socket.on('connect_error', (err) => {
    console.error('Socket auth error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location?: string;
  }) => api.post('/auth/register', data),

  registarArtisan: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    bio: string;
    skills: string[];
    experience: string;
    priceRange: string;
    location: string;
    businessName: string;
    nin: string;
    nextOfKinName: string;
    nextOfKinAddress: string;
  }) => api.post('/auth/register-artisan', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),
};

// ─── Users API ────────────────────────────────────────────────────────────────
export const usersAPI = {
  getArtisans: () => api.get('/users/artisans'),

  getArtisan: (id: string) => api.get(`/users/artisans/${id}`),

  updateProfile: (data: any) => api.put('/users/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadPortfolio: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/users/upload-portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Bookings API ─────────────────────────────────────────────────────────────
export const bookingsAPI = {
  createBooking: (data: FormData) =>
    api.post('/bookings', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getBookings:        ()           => api.get('/bookings'),
  getBooking:         (id: string) => api.get(`/bookings/${id}`),
  updateBooking:      (id: string, data: any) => api.put(`/bookings/${id}`, data),
  acceptBooking:      (id: string) => api.patch(`/bookings/${id}/accept`),
  rejectBooking:      (id: string) => api.patch(`/bookings/${id}/reject`),
  cancelBooking:      (id: string) => api.patch(`/bookings/${id}/cancel`),
  inProgressBooking:  (id: string) => api.patch(`/bookings/${id}/in-progress`),
  completeBooking:    (id: string) => api.patch(`/bookings/${id}/complete`),
};

// ─── Reviews API ──────────────────────────────────────────────────────────────
export const reviewsAPI = {
  createReview: (data: {
    artisanId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }) => api.post('/reviews', data),

  getArtisanReviews: (artisanId: string) => api.get(`/reviews/artisan/${artisanId}`),
};

// ─── Messages API ─────────────────────────────────────────────────────────────
export const messagesAPI = {
  getConversations: ()                                    => api.get('/messages/conversations'),
  getMessages:      (userId: string)                      => api.get(`/messages/${userId}`),
  sendMessage:      (receiverId: string, content: string) => api.post('/messages', { receiverId, content }),
};

// ─── Payments API ─────────────────────────────────────────────────────────────
export const paymentsAPI = {
  createPaymentIntent: (bookingId: string, amount: number) =>
    api.post('/payments/create-payment-intent', { bookingId, amount }),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  login:           (email: string, password: string) => api.post('/admin/login', { email, password }),
  getAllUsers:      ()           => api.get('/admin/users'),
  getAllBookings:   ()           => api.get('/admin/bookings'),
  getBookingHistory: ()         => api.get('/admin/booking-history'),
  verifyArtisan:   (id: string) => api.put(`/admin/verify-artisan/${id}`),
  deleteUser:      (id: string) => api.delete(`/admin/users/${id}`),
};

export default api;
