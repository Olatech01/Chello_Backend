const userModel = require("../models/Auth");
const profileModel = require("../models/Profile");


const getProfile = async (req, res) => {
    try {
        const profile = await profileModel.findOne({ user: req.params.userId }).populate('user', '-password');
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, otherName, username, phoneNumber, bio, location, website } = req.body;
        const updatedUserData = { firstName, otherName, username };
        const updatedProfileData = { phoneNumber, bio, location, website };

        if (req.file) {
            updatedProfileData.profilePicture = req.file.path;
        }

        const user = await userModel.findByIdAndUpdate(req.user._id, updatedUserData, { new: true, runValidators: true }).select('-password');
        const profile = await profileModel.findOneAndUpdate({ user: req.user._id }, updatedProfileData, { new: true, runValidators: true });

        if (!user || !profile) {
            return res.status(404).json({ error: 'User or Profile not found' });
        }

        res.status(200).json({ user, profile });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};