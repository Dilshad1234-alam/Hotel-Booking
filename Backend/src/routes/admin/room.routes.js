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

const router = express.Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

router.post("/", authenticateuser, isAdmin, createRoom);
router.put("/:id", authenticateuser, isAdmin, updateRoom);
router.delete("/:id", authenticateuser, isAdmin, deleteRoom);

export default router;