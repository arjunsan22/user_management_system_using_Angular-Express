import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Protected for any logged-in user (Admin or User)
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;