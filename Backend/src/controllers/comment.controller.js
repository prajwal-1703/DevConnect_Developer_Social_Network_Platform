import Comment from "../models/Comment.js";

// 📍 Add comment
export const addComment = async (req, res) => {
  try {
    const { postId, projectId, text } = req.body;

    if (!postId && !projectId) {
      return res.status(400).json({ msg: "Must provide postId or projectId" });
    }

    const comment = await Comment.create({
      userId: req.user.id,
      postId,
      projectId,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get comments for a post
export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username profilePicUrl")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get comments for a project
export const getCommentsForProject = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .populate("userId", "username profilePicUrl")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ msg: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
