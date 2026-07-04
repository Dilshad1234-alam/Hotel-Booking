import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
}

export const validateRegisterUser = [
    body("fullname")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters long"),

    body("email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("contact")
        .notEmpty()
        .withMessage("Contact is required")
        .matches(/^\d{10}$/)
        .withMessage("Contact must be a 10-digit number"),

    body("address")
        .optional()
        .isString()
        .withMessage("Address must be a string"),

    body("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin"),

    validateRequest,
];

export const validateLoginUser = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validateRequest,
];