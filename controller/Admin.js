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

const getAllBlockedUsers = async (req, res) => {
    try {
        const blockedUsers = await userModel.find({ isBlocked: true });
        res.status(200).json(blockedUsers);
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        res.status(500).json({ error: 'Failed to fetch blocked users' });
    }
}

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

const getAllSuspendedUsers = async (req, res) => {
    try {
        const suspendedUsers = await userModel.find({ isSuspended: true });
        res.status(200).json(suspendedUsers);
    } catch (error) {
        console.error('Error fetching suspended users:', error);
        res.status(500).json({ error: 'Failed to fetch suspended users' });
    }
}
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
        const users = await userModel.find({isAdmin: {$ne: true}});
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

const userGrowth = async (req, res) => {
    try {
        const growthData = await userModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by the month of the `createdAt` field
                    count: { $sum: 1 } // Count the number of users in each month
                }
            },
            {
                $sort: { _id: 1 } // Sort by month (January to December)
            }
        ]);

        // Map the results to include all months (1-12) with a count of 0 if no users registered in that month
        const monthlyGrowth = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            count: 0
        }));

        growthData.forEach(data => {
            monthlyGrowth[data._id - 1].count = data.count;
        });

        res.status(200).json(monthlyGrowth);
    } catch (error) {
        console.error('Error calculating user growth:', error);
        res.status(500).json({ error: 'Failed to calculate user growth' });
    }
};

module.exports = {
    blockUser,
    unblockUser,
    suspendUser,
    unsuspendUser,
    getAllUsers,
    getUserById,
    getAllBlockedUsers,
    getAllSuspendedUsers,
    userGrowth
};