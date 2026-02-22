import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};