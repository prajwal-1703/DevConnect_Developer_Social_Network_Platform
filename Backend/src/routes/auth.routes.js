import express from "express";
import {
  registerUser,
  loginUser,
  profileUpdate,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ------------------
// Auth Routes
// ------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ------------------
// Protected Routes
// ------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user comes from JWT middleware
    const user = req.user;
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user" });
  }
});

router.put("/profile/:id", authMiddleware, profileUpdate);

// ------------------
// Test Route
// ------------------
router.get("/test", (req, res) => {
  res.json({ 
    message: "Auth API is working ✅",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

export default router;
