const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const reportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    reason: {
        type: ['spam', 'abuse', 'harassment', 'nudity', 'hate speech', 'other'],
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const reportModel = model('Report', reportSchema);

module.exports = reportModel;