import express from "express";
import {
  createConversation,
  getUserConversations,
  markConversationAsRead,
} from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getUserConversations);
router.patch("/:id/read", authMiddleware, markConversationAsRead);

export default router;
