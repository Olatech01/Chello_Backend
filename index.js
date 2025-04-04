require('dotenv').config()
const express = require('express');
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const connectDB = require('./connectDb/connect');


port = process.env.port || 6060

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 64000 }
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(flash())

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(cors({
    origin: 'https://social-media-platform-ruby.vercel.app',
    credentials: true
}));


app.use("/api", require("./routes/handler"))






app.listen(port, () => {
    connectDB();
    console.log(`server started on  ${port}`)
})