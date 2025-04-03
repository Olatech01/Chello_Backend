const mongoose = require('mongoose');

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
        required: false
    },
    bio: {
        type: String,
        required: false
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

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;