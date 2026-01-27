import express from 'express'
import { getMe, login, register, registerArtisan } from '../controllers/authController'
import { protect } from '../middleware/auth'


const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/register-artisan', registerArtisan)
authRouter.post('/login', login)
authRouter.get('/me', protect, getMe)