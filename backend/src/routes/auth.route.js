import express from 'express'
import {registerUser, loginUser, getMe, updatedUserProfile} from "../controllers/auth.controller.js"
import {protect} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.route('/me').get(protect, getMe).put(protect, updatedUserProfile)

export default router;