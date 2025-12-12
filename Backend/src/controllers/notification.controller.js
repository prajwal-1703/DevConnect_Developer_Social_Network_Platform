import { Notification } from "../models/notification.js";


// 📍 Get notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate("senderId", "username profilePicUrl")
      .populate("postId", "content")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Mark notification as seen
export const markAsSeen = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: "Notification not found" });

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    notification.seen = true;
    await notification.save();

    res.json({ msg: "Notification marked as seen" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: "Notification not found" });

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await notification.deleteOne();
    res.json({ msg: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
