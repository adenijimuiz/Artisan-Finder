import express from 'express';
import { adminLogin, getAllBookings, getAllUsers, statusHistory } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/users', adminAuth, getAllUsers);
adminRouter.get('/bookings', adminAuth, getAllBookings);
adminRouter.get('/booking-history', adminAuth, statusHistory);


export default adminRouter;