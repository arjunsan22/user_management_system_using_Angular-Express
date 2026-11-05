import { Router } from 'express';
import {  getUsers, getUserById, getStats, addUser, editUser, removeUser  } from '../controllers/user/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js'


const router = Router();

router.get('/stats', protect, adminOnly, getStats);

router.get('/', protect, adminOnly, getUsers);
router.post('/', protect, adminOnly, addUser);// add users
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, editUser);
router.delete('/:id', protect, adminOnly, removeUser)

export default router;