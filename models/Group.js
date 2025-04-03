const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    groupDescription: {
        type: String,
        required: true
    },
    groupRules: [{
        type: String
    }],
    profilePhoto: {
        type: String
    },
    coverPhoto: {
        type: String
    },
    inviteMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const groupModel = model('Group', groupSchema);

module.exports = groupModel;