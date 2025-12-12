import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  imageUrl: { type: String },
  codeSnippet: { type: String },
  sentAt: { type: Date, default: Date.now },
  isSeen: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
