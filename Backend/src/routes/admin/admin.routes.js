import express from "express";
import { getAdminDashboard, getAllUsers, deleteUser, updateUserStatus, } from "../../controllers/admin/admin.controller.js";

import { authenticateuser } from "../../middleware/auth/auth.middleware.js";
import { isAdmin } from "../../middleware/admin/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", authenticateuser, isAdmin, getAdminDashboard);
router.get("/users", authenticateuser, isAdmin, getAllUsers);
router.patch("/users/:id/status", authenticateuser, isAdmin, updateUserStatus);
router.delete("/users/:id", authenticateuser, isAdmin, deleteUser);

export default router;