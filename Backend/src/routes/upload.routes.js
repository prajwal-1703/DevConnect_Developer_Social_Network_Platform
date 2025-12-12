import express from "express";
import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Upload image endpoint
router.post("/image", authMiddleware, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ msg: "Upload failed" });
  }
});

export default router;
