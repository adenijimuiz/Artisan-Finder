// import Booking from '../models/Booking.js';

import { uploadToCloudinary } from '../config/cloudinary.js';
import Booking from '../models/Booking.js';
import { sendBookingNotification } from '../utils/email.js';

// export const createBooking = async (req, res) => {
//   try {
//     const { artisanId, serviceType, description, date, time, location, budget, specialInstructions, images } = req.body;

//     const booking = await Booking.create({
//       artisan: artisanId,
//       client: req.user._id,
//       serviceType,
//       description,
//       date,
//       time,
//       location,
//       budget,
//       specialInstructions,
//       images
//     });

//     const populatedBooking = await booking.populate(['artisan', 'client']);

//     // Notify artisan via Socket.IO
//     const io = req.app.get('io');
//     io.to(`user_${artisanId}`).emit('new_booking', populatedBooking);

//     res.status(201).json({ success: true, booking: populatedBooking });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getBookings = async (req, res) => {
//   try {
//     const query = req.user.role === 'artisan' 
//       ? { artisan: req.user._id }
//       : { client: req.user._id };

//     const bookings = await Booking.find(query)
//       .populate('artisan', 'name email avatar skills rating')
//       .populate('client', 'name email avatar')
//       .sort('-createdAt');

//     res.json({ success: true, count: bookings.length, bookings });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('artisan')
//       .populate('client');

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Check authorization
//     if (booking.artisan._id.toString() !== req.user._id.toString() &&
//         booking.client._id.toString() !== req.user._id.toString() &&
//         req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     res.json({ success: true, booking });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Check authorization
//     if (booking.artisan.toString() !== req.user._id.toString() &&
//         booking.client.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).populate(['artisan', 'client']);

//     // Notify other party via Socket.IO
//     const io = req.app.get('io');
//     const notifyUserId = req.user.role === 'artisan' ? booking.client : booking.artisan;
//     io.to(`user_${notifyUserId}`).emit('booking_updated', updatedBooking);

//     res.json({ success: true, booking: updatedBooking });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const acceptBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (booking.artisan.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only the artisan can accept bookings' });
//     }

//     booking.status = 'accepted';
//     await booking.save();

//     const populatedBooking = await booking.populate(['artisan', 'client']);

//     // Notify client
//     const io = req.app.get('io');
//     io.to(`user_${booking.client}`).emit('booking_accepted', populatedBooking);

//     res.json({ success: true, booking: populatedBooking });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const completeBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     if (booking.artisan.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only the artisan can complete bookings' });
//     }

//     booking.status = 'completed';
//     await booking.save();

//     const populatedBooking = await booking.populate(['artisan', 'client']);

//     // Notify client
//     const io = req.app.get('io');
//     io.to(`user_${booking.client}`).emit('booking_completed', populatedBooking);

//     res.json({ success: true, booking: populatedBooking });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// import Booking from '../models/Booking.js';
// import { uploadToCloudinary } from '../utils/cloudinary.js';
// import { sendBookingNotification } from '../utils/email.js';

export const createBooking = async (req, res) => {
  try {
    const { artisanId, serviceType, description, date, time, location, budget, specialInstructions } = req.body;

    // Handle image uploads to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'bookings'));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));
    }

    // Create the booking
    const booking = await Booking.create({
      artisan: artisanId,
      client: req.user._id,
      serviceType,
      description,
      date,
      time,
      location,
      budget,
      specialInstructions,
      images: imageUrls
    });

    // Populate artisan and client details
    const populatedBooking = await booking.populate([
      { path: 'artisan', select: 'name email avatar skills rating' },
      { path: 'client', select: 'name email avatar' }
    ]);

    // Send email notification to artisan
    try {
      await sendBookingNotification(populatedBooking, populatedBooking.artisan, populatedBooking.client);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the entire request if email fails
    }

    // Notify artisan via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${artisanId}`).emit('new_booking', populatedBooking);
    }

    res.status(201).json({ 
      success: true, 
      booking: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'artisan' 
      ? { artisan: req.user._id }
      : { client: req.user._id };

    const bookings = await Booking.find(query)
      .populate('artisan', 'name email avatar skills rating')
      .populate('client', 'name email avatar')
      .sort('-createdAt');

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('artisan')
      .populate('client');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check authorization
    if (booking.artisan._id.toString() !== req.user._id.toString() &&
        booking.client._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check authorization
    if (booking.artisan.toString() !== req.user._id.toString() &&
        booking.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['artisan', 'client']);

    // Notify other party via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const notifyUserId = req.user.role === 'artisan' ? booking.client : booking.artisan;
      io.to(`user_${notifyUserId}`).emit('booking_updated', updatedBooking);
    }

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the artisan can accept bookings' });
    }

    booking.status = 'accepted';
    await booking.save();

    const populatedBooking = await booking.populate(['artisan', 'client']);

    // Send confirmation email to client
    try {
      const { sendBookingConfirmation } = await import('../utils/email.js');
      await sendBookingConfirmation(populatedBooking, populatedBooking.client, populatedBooking.artisan);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Notify client via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${booking.client}`).emit('booking_accepted', populatedBooking);
    }

    res.json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the artisan can complete bookings' });
    }

    booking.status = 'completed';
    await booking.save();

    const populatedBooking = await booking.populate(['artisan', 'client']);

    // Notify client via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${booking.client}`).emit('booking_completed', populatedBooking);
    }

    res.json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
