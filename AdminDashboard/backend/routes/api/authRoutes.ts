import { Router } from 'express';
import { registerUser, loginUser } from '../../controllers/authController';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new admin user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate a user & get a token
// @access  Public
router.post('/login', loginUser);

export default router;