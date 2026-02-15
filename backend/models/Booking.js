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
    type: String,
    required: true
    // coordinates: {
    //   type: { type: String, default: 'Point' },
    //   coordinates: [Number]
    // }
  },
  budget: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
   statusHistory: [
    {
      status: {
        type: String,
        required: true
      },
      changedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  images: {
    type: Array,
    default: []
  },
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

bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;