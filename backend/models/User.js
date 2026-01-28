import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'artisan', 'admin'],
    default: 'client'
  },
  phone: String,

  // Artisan specific fields
  avatar: String,
  bio: String,
  skills: {
    type: Array,
    default: []
  },
  experience: String,
  priceRange: String,
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available'
  },
  portfolio: {
    type: Array,
    default: []
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Location
  // location: {
  //   address: String,
  //   city: String,
  //   state: String,
  //   country: String,
  //   coordinates: {
  //     type: { type: String, default: 'Point' },
  //     coordinates: [Number] // [longitude, latitude]
  //   },
  //   default: {}
  // },
  
  // Verification documents
  // documents: [{
  //   type: String,
  //   url: String,
  //   uploadedAt: Date
  // }],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;