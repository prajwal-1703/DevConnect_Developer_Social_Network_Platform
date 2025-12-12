import Like from "../models/Like.js";
import Project from "../models/Project.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";

// 📍 Like
export const likeItem = async (req, res) => {
  try {
    let { postId, projectId, id, type } = req.body;
    // Accept alternate shapes
    if (!postId && type === 'post' && id) postId = id;
    if (!projectId && type === 'project' && id) projectId = id;
    if (!projectId && req.body?.project) projectId = req.body.project;
    if (!postId && req.body?.post) postId = req.body.post;

    if (!postId && !projectId) return res.status(400).json({ msg: "Must provide postId or projectId", received: req.body });

    // Normalize to ObjectId and validate target exists
    if (projectId) {
      if (!mongoose.isValidObjectId(projectId)) return res.status(400).json({ msg: "Invalid projectId", projectId });
      const proj = await Project.findById(projectId).select("_id");
      if (!proj) return res.status(404).json({ msg: "Project not found", projectId });
    }
    if (postId) {
      if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ msg: "Invalid postId", postId });
      const pst = await Post.findById(postId).select("_id");
      if (!pst) return res.status(404).json({ msg: "Post not found", postId });
    }

    // Upsert like atomically to avoid race/duplicate ambiguity
    const filter = {
      userId: req.user.id,
      ...(postId ? { postId } : {}),
      ...(projectId ? { projectId } : {}),
    };
    const insertDoc = { userId: req.user.id };
    if (postId) insertDoc.postId = postId;
    if (projectId) insertDoc.projectId = projectId;

    // Reliable upsert using findOneAndUpdate to get the created doc and created flag
    const result = await Like.findOneAndUpdate(
      filter,
      { $setOnInsert: insertDoc },
      { upsert: true, new: true, rawResult: true }
    );
    const likeDoc = result.value || null;
    const created = result.lastErrorObject ? !result.lastErrorObject.updatedExisting : false;
    return res.status(created ? 201 : 200).json({ created, like: likeDoc });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Unlike
export const unlikeItem = async (req, res) => {
  try {
    const { postId, projectId } = req.body;

    const filter = { userId: req.user.id };
    if (postId) filter.postId = postId;
    if (projectId) filter.projectId = projectId;

    await Like.findOneAndDelete(filter);
    // Idempotent success even if nothing was deleted
    res.status(200).json({ msg: "Unliked successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get likes for a post
export const getLikesForPost = async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId })
      .populate("userId", "username profilePicUrl");

    res.json({ count: likes.length, users: likes });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get likes for a project
export const getLikesForProject = async (req, res) => {
  try {
    const likes = await Like.find({ projectId: req.params.projectId })
      .populate("userId", "username profilePicUrl");

    res.json({ count: likes.length, users: likes });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
