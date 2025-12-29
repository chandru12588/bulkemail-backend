import express from "express";
import { sendBulkMail, getHistory } from "../controllers/mailController.js";

const router = express.Router();

/**
 * 📧 Bulk Email Routes
 * Auth disabled temporarily for local testing
 */

router.post("/send", sendBulkMail);
router.get("/history", getHistory);

export default router;
