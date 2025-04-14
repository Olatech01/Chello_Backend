// filepath: c:\Users\hp\Documents\Mine\SocialMediaBackend\model\Auth.js
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    otherName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    suspensionEndDate:{
        type: Date,
        default: null
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type:Date,
        default:null
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret', { expiresIn: '1h' });
    return token;
};

const userModel = model("User", userSchema);
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports = userModel;