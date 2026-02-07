import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: {
    address: String,
    // coordinates: {
    //   type: { type: String, default: 'Point' },
    //   coordinates: [Number]
    // }
  },
  budget: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  images: [String],
  specialInstructions: String,
  // paymentStatus: {
  //   type: String,
  //   enum: ['pending', 'paid', 'refunded'],
  //   default: 'pending'
  // },
  // paymentIntentId: String,
  // amount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;