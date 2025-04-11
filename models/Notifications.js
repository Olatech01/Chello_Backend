const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        // enum: ['like', 'comment', 'mention', 'follow', 'post', 'newUser', 'group', 'groupJoin', 'report', ],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
});
const notificationModel = model('Notification', notificationSchema);

module.exports = notificationModel;