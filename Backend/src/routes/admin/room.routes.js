import express from "express";
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
} from "../../controllers/admin/room.controller.js";

import { authenticateuser } from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";
import multer from "multer";


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

router.post("/", authenticateuser, isAdmin, upload.single("image"), createRoom);
router.put("/:id", authenticateuser, isAdmin, upload.single("image"), updateRoom);
router.delete("/:id", authenticateuser, isAdmin, deleteRoom);

export default router;