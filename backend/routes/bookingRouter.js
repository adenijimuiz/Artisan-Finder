import express from 'express';
import { acceptBooking, completeBooking, createBooking, getBooking, getBookings, updateBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';


const bookingRouter = express.Router();

bookingRouter.post('/', protect, createBooking);
bookingRouter.get('/', protect, getBookings);
bookingRouter.get('/:id', protect, getBooking);
bookingRouter.put('/:id', protect, updateBooking);
bookingRouter.post('/:id/accept', protect, acceptBooking);
bookingRouter.post('/:id/complete', protect, completeBooking);

export default bookingRouter;