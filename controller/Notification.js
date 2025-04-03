const notificationModel = require("../models/Notifications");

const createNotification = async (req, res) => {
    try {
        const { user, type, content, post } = req.body;

        const notification = new notificationModel({
            user,
            type,
            content,
            post
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getNotificationsByUser = async (req, res) => {
    try {
        const notifications = await notificationModel.find({ user: req.params.userId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await notificationModel.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await notificationModel.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

module.exports = {
    createNotification,
    getNotificationsByUser,
    markAsRead,
    deleteNotification,
    getNotifications
};