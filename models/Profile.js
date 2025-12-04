const mongoose = require('mongoose');
const { BASE_URL } = require('../utils/URL');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        required: false
    },
    coverPhoto: {
        type: String,
        default: null
    },
    location: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    }
}, { timestamps: true });

profileSchema.virtual('profilePictureUrl').get(function () {
    if (!this.profilePicture) {
        return null;
    }
    const baseUrl = BASE_URL || 'http://localhost:6060';
    return `${baseUrl}/${this.profilePicture.replace(/\\/g, '/')}`;
});

profileSchema.virtual('coverPhotoUrl').get(function () {
    if (!this.coverPhoto) {
        return null;
    }
    const baseUrl = BASE_URL || 'http://localhost:6060';
    return `${baseUrl}/${this.coverPhoto.replace(/\\/g, '/')}`;
});

profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;