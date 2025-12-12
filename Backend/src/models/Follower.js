// DEPRECATED: This model is no longer used. Following/followers are now stored on User.
import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  followedAt: { type: Date, default: Date.now },
});

// ✅ Ensure unique pair (followerId + followingId)
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export default mongoose.model("Follower", followerSchema);
