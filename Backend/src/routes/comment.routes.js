import express from "express";
import {
  addComment,
  getCommentsForPost,
  getCommentsForProject,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, addComment);
router.get("/post/:postId", getCommentsForPost);
router.get("/project/:projectId", getCommentsForProject);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
