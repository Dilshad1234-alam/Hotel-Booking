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

export const validateCreateRoom = [
    body("roomType")
        .notEmpty()
        .withMessage("Room type required"),

    body("pricePerNight")
        .isNumeric()
        .withMessage("Price must be numeric"),

    body("capacity")
        .isNumeric()
        .withMessage("Capacity must be numeric"),

    validateRequest
];