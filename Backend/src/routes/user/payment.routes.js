import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../controllers/admin/payment.controller.js";

import { authenticateuser } from "../../middleware/auth/auth.middleware.js";

const router = express.Router();

router.post("/create-order", authenticateuser, createRazorpayOrder);
router.post("/verify", authenticateuser, verifyRazorpayPayment);

export default router;