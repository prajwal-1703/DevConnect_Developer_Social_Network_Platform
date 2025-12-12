import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  githubLink: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ["planning", "in-progress", "completed", "on-hold"], default: "planning" },
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
});

export default mongoose.model("Project", projectSchema);
