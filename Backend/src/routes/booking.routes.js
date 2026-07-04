import express from "express";
import {
    getAllBookings,
    updateBookingStatus,
    createBooking
} from "../controllers/booking.controller.js";

import { authenticateuser } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", authenticateuser, createBooking)
router.get("/", authenticateuser, isAdmin, getAllBookings);
router.patch("/:id/status", authenticateuser, isAdmin, updateBookingStatus);

export default router;