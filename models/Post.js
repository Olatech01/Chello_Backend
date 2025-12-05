const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostSchema = new Schema({
    description: {
        type: String,
    },
    contentType: {
        type: String,
        required: true,
        enum: ['image', 'video', 'audio']
    },
    contentUrl: [{
        type: String,
        required: true
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    comments: [commentSchema],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postModel = model('Post', PostSchema);

module.exports = postModel;