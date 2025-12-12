import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  type: { 
    type: String, 
    enum: ["like", "comment", "follow", "message"],  // 👈 added here
    required: true 
  },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// in notification.js
export const Notification = mongoose.model("Notification", notificationSchema);
