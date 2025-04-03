const express = require("express");
const { register, emailVerification, login, changePassword, followUser, unFollowUser } = require("../controller/User");
const upload = require("../config/multerConfig");
const { createGroup, getGroupById, getAllGroups, updateGroup, deleteGroup } = require("../controller/Groups");
const { createPost, getAllPosts, getPostById, deletePost, updatePost, likePost, commentPost, getPostsByUser, mentionUser, bookmarkPost, unbookmarkPost, getAllBookmarks, unlikePost } = require("../controller/Posts");
const auth = require("../middleWare/auth");
const { getProfile, updateProfile } = require("../controller/ProfileController");
const { getNotifications, deleteNotification } = require("../controller/Notification");



const router = express.Router()



// Auth //

router.route("/register").post(register)
router.route("/verification").post(emailVerification)
router.route("/login").post(login)
router.route("/changePassword").post(changePassword)
router.post('/follow', auth, followUser);
router.post('/unfollow', auth, unFollowUser);


// Profile //


router.get('/profile/:userId', auth, getProfile)
router.put('/profile', auth, upload.single('profilePicture'), updateProfile)



// notification //

router.get('/notifications', auth, getNotifications);
router.delete('/notifications/:id', auth, deleteNotification);


// Groups //

router.post("/groups", auth, upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 }
]), createGroup);
router.get('/groups', auth, getAllGroups);
router.get('/groups/:id', auth, getGroupById);
router.put('/groups/:id', auth, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]), updateGroup);
router.delete('/groups/:id', auth, deleteGroup);




// Posts //

router.post("/posts", auth, upload.single('content'), createPost)
router.get("/posts", auth, getAllPosts)
router.get("/getSingelPost/:id", auth, getPostById)
router.put("/posts/:id", auth, upload.single('content'), updatePost)
router.delete("/deletePost/:id", auth, deletePost)
router.post('/posts/:id/like', auth, likePost);
router.post('posts/:id/unlike', auth, unlikePost);
router.post('/posts/:id/comment', auth, commentPost);
router.post('/posts/:id/mention', auth, mentionUser);
router.get('/posts/user/:userId', auth, getPostsByUser)
router.post('/posts/:id/bookmark', auth, bookmarkPost); 
router.post('/posts/:id/unbookmark', auth, unbookmarkPost); 
router.get('/posts/bookmarks', auth, getAllBookmarks); 






module.exports = router;