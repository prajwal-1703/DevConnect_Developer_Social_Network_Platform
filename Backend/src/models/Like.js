import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },       // optional
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // optional
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate likes (user can like only once per post/project)
likeSchema.index({ userId: 1, postId: 1 }, { unique: true, sparse: true });
likeSchema.index({ userId: 1, projectId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Like", likeSchema);
