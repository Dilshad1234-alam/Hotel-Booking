import express from "express";
import multer from "multer";
import { uploadImage } from "../../controllers/admin/upload.controller.js";
import { authenticateuser } from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateuser, isAdmin, upload.single("image"), uploadImage );

export default router;