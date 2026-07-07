import express from "express";
import {
    getAllBookings,
    updateBookingStatus,
    createBooking
} from "../../controllers/admin/booking.controller.js";

import { authenticateuser } from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";

const router = express.Router();

router.post("/", authenticateuser, createBooking)
router.get("/", authenticateuser, isAdmin, getAllBookings);
router.patch("/:id/status", authenticateuser, isAdmin, updateBookingStatus);


export default router;