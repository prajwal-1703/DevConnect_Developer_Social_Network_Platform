import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user1Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2Id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  unreadCount: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// ensure uniqueness for pair of users
conversationSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
