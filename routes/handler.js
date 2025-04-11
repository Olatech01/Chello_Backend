const express = require("express");
const { register, emailVerification, login, changePassword, followUser, unFollowUser } = require("../controller/User");
const upload = require("../config/multerConfig");
const { createGroup, getGroupById, getAllGroups, updateGroup, deleteGroup, joinGroup } = require("../controller/Groups");
const { createPost, getAllPosts, getPostById, deletePost, updatePost, likePost, commentPost, getPostsByUser, mentionUser, bookmarkPost, unbookmarkPost, getAllBookmarks, unlikePost, getAllComments } = require("../controller/Posts");
const auth = require("../middleWare/auth");
const { getProfile, updateProfile } = require("../controller/ProfileController");
const { getNotifications, deleteNotification } = require("../controller/Notification");
const { blockUser, unblockUser, suspendUser, unsuspendUser, getAllUsers, getUserById, getAllSuspendedUsers, userGrowth } = require("../controller/Admin");
const adminAuth = require("../middleWare/adminAuth");
const { getTrendingTopics, getTrendingUsers } = require("../controller/Trending");



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
router.post('/:id/join', auth, joinGroup);





// Posts //

router.post("/posts", auth, upload.single('content'), createPost)
router.get("/posts", auth, getAllPosts)
router.get("/getSingelPost/:id", auth, getPostById)
router.put("/posts/:id", auth, upload.single('content'), updatePost)
router.delete("/deletePost/:id", auth, deletePost)
router.post('/posts/:id/like', auth, likePost);
router.post('posts/:id/unlike', auth, unlikePost);
router.post('/posts/:id/comment', auth, commentPost);
router.get('/posts/:id/comments', auth, getAllComments);
router.post('/posts/:id/mention', auth, mentionUser);
router.get('/posts/user/:userId', auth, getPostsByUser)
router.post('/posts/:id/bookmark', auth, bookmarkPost); 
router.post('/posts/:id/unbookmark', auth, unbookmarkPost); 
router.get('/posts/bookmarks', auth, getAllBookmarks); 



// Trending //
router.get("/trending/topics", auth, getTrendingTopics)
router.get("/trending/users", auth, getTrendingUsers)




// Admin //
router.put("/admin/block/:userId", adminAuth, blockUser);
router.put("/admin/unblock/:userId", adminAuth, unblockUser);
router.put("/admin/suspend/:userId", adminAuth, suspendUser);
router.put("/admin/unsuspend/:userId", adminAuth, unsuspendUser);
router.get("/admin/users", adminAuth, getAllUsers);
router.get("/admin/user/:userId", adminAuth, getUserById);
router.get("/admin/allBlockedUser", adminAuth, getAllBookmarks);
router.get("/admin/allSuspendedUser", adminAuth, getAllSuspendedUsers);
router.get("/admin/userGrowth", adminAuth, userGrowth);
// router.delete("/admin/user/:userId", adminAuth, deleteUser);
// router.put("/admin/user/:userId", adminAuth, updateUser);
// router.get("/admin/notifications", adminAuth, getAllNotifications);
// router.delete("/admin/notification/:notificationId", adminAuth, deleteNotification);
// router.get("/admin/posts", adminAuth, getAllPosts);
// router.delete("/admin/post/:postId", adminAuth, deletePost);
// router.get("/admin/groups", adminAuth, getAllGroups);
// router.delete("/admin/group/:groupId", adminAuth, deleteGroup);
// router.get("/admin/comments", adminAuth, getAllComments);
// router.delete("/admin/comment/:commentId", adminAuth, deleteComment);
// router.get("/admin/likes", adminAuth, getAllLikes);
// router.delete("/admin/like/:likeId", adminAuth, deleteLike);
// router.get("/admin/bookmarks", adminAuth, getAllBookmarks);
// router.delete("/admin/bookmark/:bookmarkId", adminAuth, deleteBookmark);
// router.get("/admin/mentions", adminAuth, getAllMentions);
// router.delete("/admin/mention/:mentionId", adminAuth, deleteMention);
// router.get("/admin/hashtags", adminAuth, getAllHashtags);
// router.delete("/admin/hashtag/:hashtagId", adminAuth, deleteHashtag);







module.exports = router;