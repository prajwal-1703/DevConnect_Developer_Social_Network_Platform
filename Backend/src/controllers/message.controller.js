import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { Notification } from "../models/notification.js";

// 📍 Send message
export const sendMessage = async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body); // Debug log
    const { conversationId, text, imageUrl, codeSnippet } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ msg: "Conversation not found" });

    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      text,
      imageUrl,
      codeSnippet,
    });

    // find receiver
    const receiverId = conversation.user1Id.toString() === req.user.id
      ? conversation.user2Id
      : conversation.user1Id;

    // trigger notification
    await Notification.create({
      userId: receiverId,
      senderId: req.user.id,
      type: "message",   // 👈 extend notifications to support "message"
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate("senderId", "username profilePicUrl")
      .sort({ createdAt: 1 });

    // Transform senderId to sender object for frontend compatibility
    const transformed = messages.map(msg => {
      const obj = msg.toObject();
      obj.id = obj._id;
      obj.sender = {
        id: obj.senderId?._id || obj.senderId?.id || obj.senderId,
        username: obj.senderId?.username || "Unknown",
        avatar: obj.senderId?.profilePicUrl || ""
      };
      obj.text = obj.text || "";
      obj.imageUrl = obj.imageUrl || "";
      obj.codeSnippet = obj.codeSnippet || "";
      obj.content = obj.text || obj.imageUrl || obj.codeSnippet || "";
      delete obj.senderId;
      delete obj._id;
      return obj;
    });
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Mark message as seen
export const markAsSeen = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    message.isSeen = true;
    await message.save();

    res.json({ msg: "Message marked as seen" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
