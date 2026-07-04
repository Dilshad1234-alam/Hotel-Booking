import express from "express";
import { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel, } from "../controllers/hotel.controller.js";
import { authenticateuser} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { validateCreateHotel } from "../validator/hotel.validator.js"

const router = express.Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);

router.post("/", authenticateuser, isAdmin, validateCreateHotel, createHotel);
router.put("/:id", authenticateuser, isAdmin, validateCreateHotel, updateHotel);
router.delete("/:id", authenticateuser, isAdmin, deleteHotel);

export default router;