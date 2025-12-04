const Group = require("../models/Group");
const { BASE_URL } = require("../utils/URL");

const createGroup = async (req, res) => {
    try {
        const { groupName, groupDescription, groupRules, inviteMembers } = req.body;
        const userId = req.user._id; // Get user from authentication middleware

        // Parse JSON fields
        const rules = groupRules ? JSON.parse(groupRules) : [];
        const members = inviteMembers ? JSON.parse(inviteMembers) : [];

        let profilePhotoUrl = null;
        let coverPhotoUrl = null;

        // Process profile photo
        if (req.files && req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
            const filename = req.files['profilePhoto'][0].filename ||
                req.files['profilePhoto'][0].path.split(/[\\/]/).pop();
            profilePhotoUrl = `${BASE_URL}/uploads/${filename}`;
        }

        // Process cover photo
        if (req.files && req.files['coverPhoto'] && req.files['coverPhoto'][0]) {
            const filename = req.files['coverPhoto'][0].filename ||
                req.files['coverPhoto'][0].path.split(/[\\/]/).pop();
            coverPhotoUrl = `${BASE_URL}/uploads/${filename}`;
        }

        // Basic validation
        if (!groupName || !groupDescription) {
            return res.status(400).json({
                success: false,
                error: "Group name and description are required"
            });
        }

        const group = new Group({
            groupName,
            groupDescription,
            groupRules: rules,
            profilePhoto: profilePhotoUrl,
            coverPhoto: coverPhotoUrl,
            creator: userId,
            inviteMembers: members,
            members: [userId] // Creator is automatically a member
        });

        await group.save();

        // Populate user details
        await group.populate('creator', 'username email profilePicture');
        await group.populate('inviteMembers', 'username email profilePicture');
        await group.populate('members', 'username email profilePicture');

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: group
        });
    } catch (error) {
        console.error("Create group error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getGroupsByUser = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have authentication middleware
        
        const groups = await Group.find({ 
            creator: userId 
        })
        .populate('creator', 'username email profilePicture')
        .populate('inviteMembers', 'username email profilePicture')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    } catch (error) {
        console.error("Get groups by user error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { groupName, groupDescription, groupRules, inviteMembers } = req.body;
        const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
        const coverPhoto = req.files['coverPhoto'] ? req.files['coverPhoto'][0].path : null;

        const updatedData = {
            groupName,
            groupDescription,
            groupRules,
            inviteMembers
        };

        if (profilePhoto) updatedData.profilePhoto = profilePhoto;
        if (coverPhoto) updatedData.coverPhoto = coverPhoto;

        const group = await Group.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const joinGroup = async (req, res) => {
    try {
        const { userId } = req.body; // Assuming the user ID is sent in the request body
        const groupId = req.params.id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the user is already a member
        if (group.inviteMembers.includes(userId)) {
            return res.status(400).json({ error: 'User is already a member of this group' });
        }

        // Add the user to the group
        group.inviteMembers.push(userId);
        await group.save();

        res.status(200).json({ message: 'User successfully joined the group', group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const inviteMembers = async (req, res) => {

}



module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup,
    getGroupsByUser
};