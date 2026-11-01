import express from 'express';
import { register, login, getMe, googleLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// الحد من محاولات التخمين: 20 طلباً لكل 15 دقيقة لكل عنوان IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'محاولات كثيرة، يرجى المحاولة بعد قليل',
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.get('/me', protect, getMe);

export default router;
