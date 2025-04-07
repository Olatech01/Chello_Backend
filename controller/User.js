const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userModel = require('../models/Auth');
const profileModel = require('../models/Profile');
const notificationModel = require('../models/Notifications');
const { passwordChangeConfirmationTemplate, welcomeTemplate, passwordResetTemplate } = require('../utils/emailTemplates');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendMail(to, subject, htmlContent) {
    try {
        await transport.sendMail({
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
}

const register = async (req, res) => {
    const { username, email, password, fullName, phoneNumber, bio, location, website } = req.body;

    try {
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiration = Date.now() + 10 * 60 * 1000;

        const newUser = await userModel.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            verificationToken: otp,
            otpExpiration,
            isVerified: false
        });

        const newProfile = await profileModel.create({
            user: newUser._id,
            phoneNumber,
            bio,
            location,
            website
        });

        newUser.profile = newProfile._id;
        await newUser.save();

        const subject = "Welcome to Our Platform - Verify Your Email";
        const htmlContent = welcomeTemplate(username, otp);
        await sendMail(email, subject, htmlContent);



        return res.status(201).json({
            msg: "User registered successfully. Please verify your email.",
            newUser,
            newProfile
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Failed to register" });
    }
}



const emailVerification = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otpExpiration < Date.now()) {
            return res.status(400).json({ error: "OTP expired" });
        }
        if (user.verificationToken !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({ msg: "Email verification successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to verify email" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: "Your account has been blocked by the admin." });
        }
        if (user.isSuspended) {
            if (user.suspensionEndDate && user.suspensionEndDate > Date.now()) {
                return res.status(403).json({ error: `Your account is suspended until ${user.suspensionEndDate}` });
            } else {
                user.isSuspended = false;
                user.suspensionEndDate = null;
                await user.save();
            }
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '5h' });

        return res.json({
            msg: "Logged in successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                token: token,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // Send password change confirmation email
        const subject = "Your Password Has Been Changed";
        const htmlContent = passwordChangeConfirmationTemplate(user.username);
        await sendMail(email, subject, htmlContent);

        return res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ error: "An error occurred while changing the password" });
    }
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const subject = "Password Reset Request";
        const htmlContent = passwordResetTemplate(user.username, resetLink);

        await sendMail(email, subject, htmlContent);
        return res.status(200).json({ msg: "Password reset email sent" });
    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ error: "Failed to process password reset" });
    }
}

const followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;

        const userToFollow = await userModel.findById(userIdToFollow);
        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = await userModel.findById(req.user._id);
        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        currentUser.following.push(userIdToFollow);
        await currentUser.save();

        userToFollow.followers.push(req.user._id);
        await userToFollow.save();

        const notification = new notificationModel({
            user: userIdToFollow,
            type: 'follow',
            content: `${req.user.username} started following you`,
            image: `${req.user.profilePicture}`,
            fullName: `${req.user.fullName}`

        });

        await notification.save();

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const unFollowUser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.body;

        const userToUnfollow = await userModel.findById(userIdToUnfollow);
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = await userModel.findById(req.user._id);
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        currentUser.following.pull(userIdToUnfollow);
        await currentUser.save();

        userToUnfollow.followers.pull(req.user._id);
        await userToUnfollow.save();


        const notification = await notificationModel.findOneAndDelete({
            user: userIdToUnfollow,
            type: 'unfollow',
            content: `${req.user.username} unfollow you`,
        });
        if (notification) {
            await notification.remove();
        }


        await notification.save();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const inviteUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const subject = "You're Invited! Join Us Now";
        const htmlContent = `<p>Hi,</p><p>${user.username} has invited you to join our platform. Click <a href="${process.env.FRONTEND_URL}/register">here</a> to sign up!</p>`;
        await sendMail(email, subject, htmlContent);

        return res.status(200).json({ msg: "Invitation sent successfully" });
    } catch (error) {
        console.error("Error sending invitation:", error);
        return res.status(500).json({ error: "Failed to send invitation" });
    }
}


module.exports = {
    register,
    emailVerification,
    login,
    changePassword,
    followUser,
    requestPasswordReset,
    unFollowUser,
    inviteUser
};