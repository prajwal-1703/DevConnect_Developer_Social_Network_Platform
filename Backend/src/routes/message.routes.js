import express from "express";
import {
  sendMessage,
  getMessages,
  markAsSeen,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessages);
router.put("/:id/seen", authMiddleware, markAsSeen);

export default router;
