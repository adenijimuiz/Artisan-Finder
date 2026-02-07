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

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('artisan')
      .populate('client');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.artisan._id.toString() !== req.user._id.toString() &&
        booking.client._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.artisan.toString() !== req.user._id.toString() &&
        booking.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['artisan', 'client']);

    // Notify other party via Socket.IO
    const io = req.app.get('io');
    const notifyUserId = req.user.role === 'artisan' ? booking.client : booking.artisan;
    io.to(`user_${notifyUserId}`).emit('booking_updated', updatedBooking);

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
