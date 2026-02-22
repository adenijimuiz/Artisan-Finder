import express from 'express';
import { adminLogin, getAllUsers } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/login-admin', adminLogin);
adminRouter.get('/users', getAllUsers);


export default adminRouter;