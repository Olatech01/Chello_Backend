const userModel = require("../models/Auth");
const profileModel = require("../models/Profile");


const BASE_URL = "http://localhost:6060"

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
        const { username, phoneNumber, bio, location, website } = req.body;
        const updatedUserData = { username };
        const updatedProfileData = { phoneNumber, bio, location, website };

        // Check if files were uploaded
        if (req.files) {
            // Handle profile picture
            if (req.files.profilePicture && req.files.profilePicture[0]) {
                updatedProfileData.profilePicture = req.files.profilePicture[0].path;
            }

            // Handle cover photo
            if (req.files.coverPhoto && req.files.coverPhoto[0]) {
                updatedProfileData.coverPhoto = req.files.coverPhoto[0].path;
            }
        }

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            updatedUserData,
            { new: true, runValidators: true }
        ).select('-password');

        const profile = await profileModel.findOneAndUpdate(
            { user: req.user._id },
            updatedProfileData,
            { new: true, runValidators: true }
        );

        if (!user || !profile) {
            return res.status(404).json({ error: 'User or Profile not found' });
        }

        // Prepare response with full URLs
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const responseProfile = profile.toObject();

        // Add full URLs for images
        if (responseProfile.profilePicture) {
            responseProfile.profilePictureUrl = `${baseUrl}/${responseProfile.profilePicture.replace(/\\/g, '/')}`;
        }

        if (responseProfile.coverPhoto) {
            responseProfile.coverPhotoUrl = `${baseUrl}/${responseProfile.coverPhoto.replace(/\\/g, '/')}`;
        }

        res.status(200).json({
            user,
            profile: responseProfile
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};