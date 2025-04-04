const Group = require("../models/Group");

const createGroup = async (req, res) => {
    try {
        const { groupName, groupDescription, groupRules, inviteMembers } = req.body;
        const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
        const coverPhoto = req.files['coverPhoto'] ? req.files['coverPhoto'][0].path : null;

        if (!groupName || !groupDescription || !groupRules || !inviteMembers) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const group = new Group({
            groupName,
            groupDescription,
            groupRules,
            profilePhoto,
            coverPhoto,
            inviteMembers
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
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


module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    joinGroup
};