import express from "express";
import { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel, } from "../../controllers/admin/hotel.controller.js";
import { authenticateuser} from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";
import { validateCreateHotel } from "../../validator/admin/hotel.validator.js"
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024  // 5 MB
    }
})


const router = express.Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);

router.post("/", authenticateuser, isAdmin, upload.single("image"), validateCreateHotel, createHotel);
router.put("/:id", authenticateuser, isAdmin, upload.single("image"), validateCreateHotel, updateHotel);
router.delete("/:id", authenticateuser, isAdmin, deleteHotel);

export default router;