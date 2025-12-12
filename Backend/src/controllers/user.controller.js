import User from "../models/User.js";

// 📍 Search users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username email profilePicUrl')
    .limit(10);
    const transformedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      avatar: user.profilePicUrl
    }));
    res.json(transformedUsers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Update profile (only for logged-in user)


// Update Profile (with file upload support)
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, bio, location, github, website, skills } = req.body;

    // If a file is uploaded, multer saves it in req.file
    let profilePicUrl;
    if (req.file) {
      profilePicUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Parse skills if it's a string
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        skillsArray = [];
      }
    }

    const updateData = {
      ...(username !== undefined && { username }),
      ...(email !== undefined && { email }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(github !== undefined && { github }),
      ...(website !== undefined && { website }),
      ...(skillsArray.length > 0 && { skills: skillsArray }),
      ...(profilePicUrl && { profilePicUrl }), // only update if file uploaded
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Follow a user
export const followUser = async (req, res) => {
  try {
    const { id: followingId } = req.params;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }
    // Use $addToSet to avoid duplicates and perform two updates
    const followerUpdate = await User.findByIdAndUpdate(
      followerId,
      { $addToSet: { following: followingId } },
      { new: true }
    ).select('following');

    const followingUpdate = await User.findByIdAndUpdate(
      followingId,
      { $addToSet: { followers: followerId } },
      { new: true }
    ).select('followers');

    if (!followerUpdate || !followingUpdate) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Recompute counts based on arrays
    const followerCount = Array.isArray(followerUpdate.following) ? followerUpdate.following.length : 0;
    const followingCount = Array.isArray(followingUpdate.followers) ? followingUpdate.followers.length : 0;

    // Persist counts (best-effort)
    await User.findByIdAndUpdate(followerId, { followersCount: undefined, followingCount: followerCount }).catch(() => {});
    await User.findByIdAndUpdate(followingId, { followersCount: followingCount, followingCount: undefined }).catch(() => {});

    return res.json({ success: true, following: true });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { id: followingId } = req.params;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ msg: "You cannot unfollow yourself" });
    }
    // Remove from arrays using $pull
    const followerUpdate = await User.findByIdAndUpdate(
      followerId,
      { $pull: { following: followingId } },
      { new: true }
    ).select('following');

    const followingUpdate = await User.findByIdAndUpdate(
      followingId,
      { $pull: { followers: followerId } },
      { new: true }
    ).select('followers');

    if (!followerUpdate || !followingUpdate) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const followerCount = Array.isArray(followerUpdate.following) ? followerUpdate.following.length : 0;
    const followingCount = Array.isArray(followingUpdate.followers) ? followingUpdate.followers.length : 0;

    // Persist updated counts (best-effort)
    await User.findByIdAndUpdate(followerId, { followingCount: followerCount }).catch(() => {});
    await User.findByIdAndUpdate(followingId, { followersCount: followingCount }).catch(() => {});

    return res.json({ success: true, following: false });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username profilePicUrl');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get following of a user
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username profilePicUrl');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


