import Conversation from "../models/Conversation.js";

// 📍 Start a conversation
export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    if (req.user.id === userId) {
      return res.status(400).json({ msg: "Cannot start a conversation with yourself" });
    }

    let conversation = await Conversation.findOne({
      $or: [
        { user1Id: req.user.id, user2Id: userId },
        { user1Id: userId, user2Id: req.user.id },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: req.user.id,
        user2Id: userId,
      });
    }

    if (conversation) {
      const convObj = conversation.toObject();
      convObj.id = convObj._id;
      delete convObj._id;
      res.json(convObj);
    } else {
      res.status(404).json({ msg: 'Conversation not found' });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get all conversations of logged-in user
export const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ user1Id: req.user.id }, { user2Id: req.user.id }],
    })
      .populate("user1Id", "username profilePicUrl")
      .populate("user2Id", "username profilePicUrl");

    const convs = conversations.map(c => {
      const obj = c.toObject();
      obj.id = obj._id;
      delete obj._id;
      return obj;
    });
    res.json(convs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
