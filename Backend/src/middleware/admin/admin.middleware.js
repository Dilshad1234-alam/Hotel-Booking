import { authenticateuser } from '../../middleware/auth/auth.middleware.js'

export const isAdmin = (req, res, next) => {

    // Check if user exists
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    // Check admin role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only."
        });
    }

    next();
};