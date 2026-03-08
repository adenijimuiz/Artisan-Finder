import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('/conversations', protect, getConversations);
messageRouter.get('/:userId', protect, getMessages);
messageRouter.post('/', protect, sendMessage);

export default messageRouter;