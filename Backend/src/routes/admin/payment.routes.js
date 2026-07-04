import express from "express";
import {
    getAllPayments,
    refundPayment,
} from "../controllers/payment.controller.js";

import { authenticateuser } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", authenticateuser, isAdmin, getAllPayments);
router.patch("/:id/refund", authenticateuser, isAdmin, refundPayment);

export default router;