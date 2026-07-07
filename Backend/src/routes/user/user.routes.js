import express from "express";
import {
  getUserHotels,
  getUserHotelById,
  createUserBooking,
  getMyBookings,
  createReview,
  smartHotelMatch,
} from "../../controllers/user/user.controller.js";

import { authenticateuser } from "../../middleware/auth/auth.middleware.js";

const router = express.Router();

router.get("/hotels", getUserHotels);
router.get("/hotels/:id", getUserHotelById);

router.post("/bookings", authenticateuser, createUserBooking);
router.get("/my-bookings", authenticateuser, getMyBookings);

router.post("/reviews", authenticateuser, createReview);

router.post("/ai-match", smartHotelMatch);


export default router;