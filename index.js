require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const connectDB = require('./connectDb/connect');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Important for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-very-strong-secret-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Serve uploaded files - PERFECT
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// CORS - Update this when you have backend domain
app.use(cors({
    origin: [
        'https://social-media-platform-ruby.vercel.app',
        'http://localhost:3000', // For local dev
    ],
    credentials: true
}));

// Routes
app.use("/api", require("./routes/handler"));

// Health check
app.get('/', (req, res) => {
    res.json({ message: "PingIt API is running!" });
});

// Fix: Use uppercase PORT
const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads available at: /uploads`);
});