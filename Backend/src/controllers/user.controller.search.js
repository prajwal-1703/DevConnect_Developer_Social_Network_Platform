// Search users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json([]);
    }

    // Search users by username or email, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username email profilePicUrl') // Only return necessary fields
    .limit(10); // Limit results

    // Transform data to match frontend expectations
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