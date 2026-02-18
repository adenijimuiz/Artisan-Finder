import Review from "../models/Review.js";
import Booking from "../models/Booking.js"

export const createReview = async (req, res) => {
  try {
    const { artisanId, bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ message: 'Booking must be completed to leave a review' });
    }

    // Check if user is the client
    if (booking.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the client can leave a review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = await Review.create({
      artisan: artisanId,
      client: req.user._id,
      booking: bookingId,
      rating,
      comment
    });

    const populatedReview = await review.populate('client', 'name avatar');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getArtisanReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ artisan: req.params.artisanId })
      .populate('client', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};