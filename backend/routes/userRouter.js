import express from 'express'
import { getArtisan, getArtisans, updateProfile, uploadAvatar, uploadPortfolio } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/multer.js'


const userRouter = express.Router()


userRouter.get('/artisans', getArtisans) //✅✅✅
userRouter.get('/artisans/:id', getArtisan) //✅✅✅
userRouter.put('/profile', protect, updateProfile)
userRouter.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);//✅✅✅
userRouter.post('/upload-portfolio', protect, upload.array('images', 10), uploadPortfolio);//✅✅✅



export default userRouter