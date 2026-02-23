import express from 'express';
import { adminLogin, getAllUsers } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/users', adminAuth, getAllUsers);


export default adminRouter;