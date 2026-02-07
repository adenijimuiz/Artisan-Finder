import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const { artisanId, serviceType, description, date, time, location, budget, specialInstructions, images } = req.body;

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
      images
    });

    const populatedBooking = await booking.populate(['artisan', 'client']);

    // Notify artisan via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${artisanId}`).emit('new_booking', populatedBooking);

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};
