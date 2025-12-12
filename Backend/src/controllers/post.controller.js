import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Tag from "../models/Tag.js";
// 📍 Create a post
// export const createPost = async (req, res) => {
//   try {
//     const { content, imageUrl, tags } = req.body;

//     const newPost = await Post.create({
//       userId: req.user.id,
//       content,
//       imageUrl,
//       tags,
//     });

//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };



export const createPost = async (req, res) => {
  try {
    const { content, tags, codeSnippet, codeLanguage } = req.body;
    let imageUrl = null;

    // If multer stored a file, use its path as URL
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Ensure tags exist in DB
    const tagsArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];
    await Promise.all(
      tagsArray.map(async (tag) => {
        await Tag.findOneAndUpdate(
          { name: tag.trim() },
          { name: tag.trim() },
          { upsert: true, new: true }
        );
      })
    );

    // Fetch tag IDs
    const tagDocs = await Tag.find({ name: { $in: tagsArray } });

    const newPost = await Post.create({
      userId: req.user.id,
      content,
      imageUrl,
      codeSnippet: codeSnippet || undefined,
      codeLanguage: codeLanguage || undefined,
      tags: tagDocs.map((t) => t._id),
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// 📍 Get all posts (feed/explore)
export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(Math.max(1, parseInt(req.query.limit)) || 20, 50);
    const skip = (page - 1) * limit;

    // Fetch posts with author info
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "_id username name profilePicUrl followers"
      })
      .populate("comments");

    // For isFollowed, get current user's following[] array (if logged in)
    let followingArr = [];
    if (req.user && req.user.id) {
      const u = await User.findById(req.user.id, "following");
      if (u) followingArr = u.following.map((id) => id.toString());
    }

    // Count total
    const total = await Post.countDocuments();

    const currentUserId = req.user?.id?.toString();
    const mapped = posts.map((post) => {
      const author = post.userId;
      const likesArray = Array.isArray(post.likes) ? post.likes.map((id) => id.toString()) : [];
      const isLiked = currentUserId ? likesArray.includes(currentUserId) : false;
      return {
        _id: post._id,
        content: post.content,
        imageUrl: post.imageUrl || '',
        codeSnippet: post.codeSnippet || '',
        codeLanguage: post.codeLanguage || '',
        createdAt: post.createdAt,
        isLiked,
        likesCount: likesArray.length,
        author: author
          ? {
              _id: author._id,
              username: author.username,
              name: author.name,
              avatar: author.profilePicUrl || author.avatar,
              isFollowed:
                req.user && author._id && author._id.toString() !== req.user.id
                  ? followingArr.includes(author._id.toString())
                  : false,
            }
          : {
              _id: null,
              username: 'Unknown User',
              name: '',
              avatar: '',
              isFollowed: false,
            },
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
      };
    });
    res.json({ posts: mapped, page, pageSize: limit, total });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get posts by user
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate("userId", "username profilePicUrl")
      .populate("comments")
      .populate("tags")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username profilePicUrl")
      .populate("comments")
      .populate("tags");

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Delete post (only owner)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Like post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({ msg: "Post liked" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Unlike post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user.id.toString()
    );
    await post.save();

    res.json({ msg: "Post unliked" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
