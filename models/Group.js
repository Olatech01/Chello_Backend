const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    groupDescription: {
        type: String,
        required: true,
        trim: true
    },
    groupRules: [{
        type: String,
        trim: true
    }],
    profilePhoto: {
        type: String,
        default: ''
    },
    coverPhoto: {
        type: String,
        default: ''
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    memberCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Update memberCount before saving
groupSchema.pre('save', function(next) {
    this.memberCount = 1 + (this.members ? this.members.length : 0);
    next();
});

const groupModel = model('Group', groupSchema);

module.exports = groupModel;