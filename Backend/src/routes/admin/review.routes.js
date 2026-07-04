import express from "express";
import {
    getAllReviews,
    approveReview,
    deleteReview,
} from "../../controllers/admin/review.controller.js";

import { authenticateuser} from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";

const router = express.Router();

router.get("/", authenticateuser, isAdmin, getAllReviews);
router.patch("/:id/approve", authenticateuser, isAdmin, approveReview);
router.patch("/:id/delete", authenticateuser, isAdmin, deleteReview);

export default router;