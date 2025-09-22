import { Router } from 'express';
import User from '../../models/User';
import { authMiddleware } from '../../middleware/auth';
import { roleMiddleware } from '../../middleware/role';

const router = Router();

// @route   GET /auth/admin/profile
// @desc    Get the profile of the currently logged-in user
// @access  Private
router.get(
    '/profile',
    authMiddleware,
    roleMiddleware(['super_admin', 'analyst']), //role based access control.
    async (req, res) => {
        try {
            const user = await User.findOne({ id: req.user!.id }).select('-passwordHash -mfaSecret');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

export default router;