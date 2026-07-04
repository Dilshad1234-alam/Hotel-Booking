import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { authenticateuser } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateuser, isAdmin, upload.single("image"), uploadImage );

export default router;