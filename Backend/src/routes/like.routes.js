import express from "express";
import {
  likeItem,
  unlikeItem,
  getLikesForPost,
  getLikesForProject,
} from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", authMiddleware, likeItem);
router.delete("/", authMiddleware, unlikeItem);
router.get("/post/:postId", getLikesForPost);
router.get("/project/:projectId", getLikesForProject);

export default router;
