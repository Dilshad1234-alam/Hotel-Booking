import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

export const validateCreateHotel = [
    body("name")
        .notEmpty()
        .withMessage("Hotel name is required"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),

    body("city")
        .notEmpty()
        .withMessage("City is required"),

    body("description")
        .notEmpty()
        .withMessage("Description is required"),

    validateRequest
];