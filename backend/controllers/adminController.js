import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

export const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({email, role:'admin'}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
      res.json({success: true, token, admin: {email, name: 'Admin', role:'admin'}});
    }else{
      res.json({success: false, message: 'Invalid Credentials'})
    }

  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-portfolio').sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('artisan', 'name email')
      .populate('client', 'name email')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const statusHistory = async (req, res) => {
  try {
    const statusHistory = await Booking.find().select('status serviceType').sort().lean()

    res.json({success: true, statusHistory})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const verifyArtisan = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!user || user.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};