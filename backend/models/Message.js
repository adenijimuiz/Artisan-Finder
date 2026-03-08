import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    url: String,
    type: String,
    name: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;