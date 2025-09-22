import { Router } from 'express';
import { registerUser, loginUser, setupMFA, verifyMFA, forgotPassword, resetPassword } from '../../controllers/authController';
import { authMiddleware } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { loginSchema, registerSchema } from '../../validators/auth';

const router = Router();

// @route   POST /auth/admin/register
// @desc    Register a new admin user
// @access  Public
router.post('/register', validate(registerSchema), registerUser);

// @route   POST /auth/admin/login
// @desc    Authenticate a user & get a token
// @access  Public
router.post('/login', validate(loginSchema), loginUser);

// @route   POST /auth/admin/totp-setup
// @desc    Generate and save MFA secret (protected route)
// @access  Private (requires temporary JWT)
router.post('/totp-setup', setupMFA);

// @route   POST /auth/admin/verify-totp
// @desc    Verify 2FA token and issue final JWT
// @access  Public
router.post('/verify-totp', verifyMFA);

// @route   POST /auth/admin/forgot-password
// @desc    Send password reset link to user email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /auth/admin/reset-password
// @desc    Reset password reset link to user email
// @access  Public
router.post('/reset-password', resetPassword);

export default router;