import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(req.user._id) },
            { receiver: new mongoose.Types.ObjectId(req.user._id) }
          ]
        }
      },
      // ✅ Fix 2: Group FIRST, then sort — $sort before $group loses ordering after grouping
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(req.user._id)] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(req.user._id)] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 } // ✅ Sort after group on the preserved lastMessage
      }
    ]);

    const populated = await User.populate(conversations, {
      path: '_id',
      select: 'name avatar role skills'
    });

    res.json({ success: true, conversations: populated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort('timestamp');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    // Send via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${receiverId}`).emit('new_message', message);

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};