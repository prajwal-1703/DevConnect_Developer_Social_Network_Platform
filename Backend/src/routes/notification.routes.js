import express from "express";
import {
  getNotifications,
  markAsSeen,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/", authMiddleware, getNotifications);
router.put("/:id/seen", authMiddleware, markAsSeen);
router.delete("/:id", authMiddleware, deleteNotification);

export default router;
