const jwt = require('jsonwebtoken');
const userModel = require('../models/Auth');
const jwtSecret = process.env.JWT_SECRET;

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecret);

        const user = await userModel.findById(decoded.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = adminAuth;