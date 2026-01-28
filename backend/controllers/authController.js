import jwt from 'jsonwebtoken';
import { geocodeAddress } from '../utils/geocoding.js';
import User from '../models/User.js';


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};


// Register a new client
export const register = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    //will be removing location for now

    // Geocode location if provided
    // let locationData = {};
    // if (location) {
    //   const coords = await geocodeAddress(location);
    //   if (coords) {
    //     locationData = {
    //       address: location,
    //       coordinates: {
    //         type: 'Point',
    //         coordinates: [coords.lng, coords.lat]
    //       }
    //     };
    //   }
    // }

    const user = await User.create({
      name,
      email,
      password,
      verified: true
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Register an Artisan
export const registerArtisan = async (req, res) => {
  try {
    const { name, email, password, bio, skills, experience, priceRange, portfolio } = req.body;

    // Geocode location if provided
    // let locationData = {};
    // if (location) {
    //   const coords = await geocodeAddress(location);
    //   if (coords) {
    //     locationData = {
    //       address: location,
    //       coordinates: {
    //         type: 'Point',
    //         coordinates: [coords.lng, coords.lat]
    //       }
    //     };
    //   }
    // }
    

    const user = await User.create({
      name,
      email,
      password,
      location: locationData,
      role: 'artisan',
      bio,
      skills,
      experience,
      priceRange,
      portfolio
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        skills: user.skills,
        experience: user.experience,
        location: user.location?.address,
        rating: user.rating,
        reviewCount: user.reviewCount,
        priceRange: user.priceRange,
        availability: user.availability,
        portfolio: user.portfolio,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};