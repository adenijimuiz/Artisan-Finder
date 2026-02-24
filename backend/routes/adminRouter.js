import express from 'express';
import { adminLogin, deleteUser, getAllBookings, getAllUsers, statusHistory, verifyArtisan } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.get('/bookings', adminAuth, getAllBookings);
adminRouter.get('/booking-history', adminAuth, statusHistory);
adminRouter.put('/verify-artisan/:id', adminAuth, verifyArtisan);
adminRouter.delete('/users/:id', adminAuth, deleteUser);


export default adminRouter;