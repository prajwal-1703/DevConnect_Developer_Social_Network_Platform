import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  imageUrl: { type: String },
  codeSnippet: { type: String },
  codeLanguage: { type: String },
  createdAt: { type: Date, default: Date.now },

  // relationships
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
});

postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);
