import { Router } from 'express';
import { registerUser, loginUser, setupMFA, verifyMFA, forgotPassword, resetPassword } from '../../controllers/authController';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new admin user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate a user & get a token
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/mfa-setup
// @desc    Generate and save MFA secret (protected route)
// @access  Private (requires temporary JWT)
router.post('/mfa-setup', authMiddleware, setupMFA);

// @route   POST /api/auth/mfa-verify
// @desc    Verify 2FA token and issue final JWT
// @access  Public
router.post('/mfa-verify', verifyMFA);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset link to user email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password reset link to user email
// @access  Public
router.post('/reset-password', resetPassword);

export default router;