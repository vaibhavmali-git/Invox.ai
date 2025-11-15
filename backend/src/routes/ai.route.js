import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getDashboardSummary,
  generateReminderEmail,
  parseInvoiceFromText,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-reminder", protect, generateReminderEmail);
router.get("/dashboard-summary", protect, getDashboardSummary);

export default router;
