const jwt = require('jsonwebtoken');
const userModel = require('../models/Auth');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        const user = await userModel.findOne({ _id: decoded.id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'You are not authorize. Please login to continue...' });
    }
};

module.exports = auth;