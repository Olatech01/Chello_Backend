const userModel = require('../models/Auth');

// Block a user
const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ error: 'Failed to block user' });
    }
};

// Unblock a user
const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isBlocked = false;
        await user.save();

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Failed to unblock user' });
    }
};

// Suspend a user
const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { suspensionDuration } = req.body; // Duration in days

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const suspensionEndDate = new Date();
        suspensionEndDate.setDate(suspensionEndDate.getDate() + suspensionDuration);

        user.isSuspended = true;
        user.suspensionEndDate = suspensionEndDate;
        await user.save();

        res.status(200).json({ message: `User suspended for ${suspensionDuration} days` });
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({ error: 'Failed to suspend user' });
    }
};

// Unsuspend a user (automatically or manually)
const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isSuspended = false;
        user.suspensionEndDate = null;
        await user.save();

        res.status(200).json({ message: 'User unsuspended successfully' });
    } catch (error) {
        console.error('Error unsuspending user:', error);
        res.status(500).json({ error: 'Failed to unsuspend user' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

module.exports = {
    blockUser,
    unblockUser,
    suspendUser,
    unsuspendUser,
    getAllUsers,
    getUserById
};