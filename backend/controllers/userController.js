import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";


export const getArtisans = async (req, res) => {
  try {
    // const { category, location, minRating, maxDistance, sortBy } = req.query;
    
    // let query = { role: 'artisan' };
    
    // // Filter by category/skills
    // if (category) {
    //   query.skills = { $in: [new RegExp(category, 'i')] };
    // }
    
    // // Filter by minimum rating
    // if (minRating) {
    //   query.rating = { $gte: parseFloat(minRating) };
    // }

    // let artisans;

    // // Geospatial query for nearby artisans
    // // if (location && maxDistance) {
    // //   const coords = await geocodeAddress(location);
    // //   if (coords) {
    // //     artisans = await User.find({
    // //       ...query,
    // //       'location.coordinates': {
    // //         $near: {
    // //           $geometry: {
    // //             type: 'Point',
    // //             coordinates: [coords.lng, coords.lat]
    // //           },
    // //           $maxDistance: parseInt(maxDistance) * 1609 // Convert miles to meters
    // //         }
    // //       }
    // //     });
    // //   }
    // // } else {
    // //   artisans = await User.find(query);
    // // }

    // // Sort results
    // if (sortBy === 'rating') {
    //   artisans.sort((a, b) => b.rating - a.rating);
    // } else if (sortBy === 'reviews') {
    //   artisans.sort((a, b) => b.reviewCount - a.reviewCount);
    // }

    const artisans = await User.find({role: 'artisan'})

    res.json({ success: true,  artisans });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getArtisan = async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id);
    
    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    res.json({ success: true, artisan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({ success: true, avatar: result.secure_url, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadPortfolio = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload files' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const urls = await Promise.all(uploadPromises);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { portfolio: { $each: urls } } },
      { new: true }
    );

    res.json({ success: true, portfolio: urls, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};