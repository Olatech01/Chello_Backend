



const { Report } = require('../models/Report');
const { User } = require('../models/Auth');
const { Post } = require('../models/Post');
const { Notification } = require('../models/Notifications');
const { Group } = require('../models/Group');




const reportUser = async (req, res) => {
    try {
        const { userId, postId, reason, comment } = req.body;
        const report = await Report.create({
            user: userId,
            post: postId,
            reason,
            comment
        });
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        const notification = await Notification.create({
            user: post.user,
            type: 'report',
            content: `${user.name} reported your post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        });
        res.status(201).json({ message: 'Report created successfully', report, notification });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const reportPost = async (req, res) => {
    try {
        const { userId, postId, reason, comment } = req.body;
        const report = await Report.create({
            user: userId,
            post: postId,
            reason,
            comment
        });
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        const notification = await Notification.create({
            user: post.user,
            type: 'report',
            content: `${user.name} reported your post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        });
        res.status(201).json({ message: 'Report created successfully', report, notification });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('user').populate('post');
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findById(id).populate('user').populate('post');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndDelete(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const reportGroup = async (req, res) => {
    try {
        const { userId, groupId, reason, comment } = req.body;
        const report = await Report.create({
            user: userId,
            group: groupId,
            reason,
            comment
        });
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);
        const notification = await Notification.create({
            user: group.user,
            type: 'report',
            content: `${user.name} reported your group.`,
            group: group._id,
            createdAt: new Date(),
            read: false
        });
        res.status(201).json({ message: 'Report created successfully', report, notification });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('user').populate('post').populate('group');
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    reportUser,
    getReports,
    getReportById,
    deleteReport,
    reportGroup,
    reportPost,
    getAllReports,
};