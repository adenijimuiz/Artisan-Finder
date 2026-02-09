import express from 'express';
import { acceptBooking, completeBooking, createBooking, getBooking, getBookings, updateBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';


const bookingRouter = express.Router();

// Create a new booking with image upload
bookingRouter.post('/', protect, upload.array('images', 5), createBooking); //✅✅✅

// Get all bookings for current user
bookingRouter.get('/', protect, getBookings); //✅✅✅

// Get single booking by ID
bookingRouter.get('/:id', protect, getBooking); //✅✅✅


bookingRouter.put('/:id', protect, updateBooking);

// Accept booking (artisan only)
bookingRouter.patch('/:id/accept', protect, acceptBooking);//✅✅✅

// Complete booking (artisan only)
bookingRouter.patch('/:id/complete', protect, completeBooking);

export default bookingRouter;