import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

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
      .populate("user2Id", "username profilePicUrl")
      .populate("lastMessage");

    const enriched = await Promise.all(conversations.map(async (c) => {
      const obj = c.toObject();
      obj.id = String(obj._id);
      
      // Fallback for missing lastMessage field (legacy data)
      if (!obj.lastMessage) {
        const lastMsg = await Message.findOne({ conversationId: obj._id }).sort({ createdAt: -1 });
        if (lastMsg) {
          console.log(`Fallback found for conversation ${obj.id}: ${lastMsg.text || 'media'}`);
          obj.lastMessage = lastMsg.toObject();
        }
      }
      
      delete obj._id;
      return obj;
    }));

    console.log(`Sending ${enriched.length} enriched conversations to client`);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Mark conversation as read (reset unread count)
export const markConversationAsRead = async (req, res) => {
  try {
    await Conversation.findByIdAndUpdate(req.params.id, { unreadCount: 0 });
    res.json({ msg: "Conversation marked as read" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
