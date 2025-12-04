const postModel = require('../models/Post');
const notificationModel = require('../models/Notifications');
const { BASE_URL } = require('../utils/URL');

const base_url = BASE_URL

const createPost = async (req, res) => {
    try {
        const { description } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const contentUrls = [];
        let contentType = "text";

        const processFiles = (files, type) => {
            if (files && files.length > 0) {
                files.forEach(file => {
                    const filename = file.filename || file.path.split(/[\\/]/).pop();
                    contentUrls.push(`${base_url}/uploads/${filename}`);
                });
                contentType = type;
            }
        };

        processFiles(req.files.images, "image");
        processFiles(req.files.videos, "video");
        processFiles(req.files.audios, "audio");

        if (contentUrls.length === 0 && description) {
            contentType = "text";
        }

        const post = new postModel({
            description: description || "",
            contentType,
            contentUrl: contentUrls, 
            user: req.user._id
        });

        await post.save();

        await post.populate('user', 'username email profilePicture');

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};



const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.aggregate([
            { $sample: { size: 100 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'profiles', // Assuming your profile collection is named 'profiles'
                                localField: 'profile',
                                foreignField: '_id',
                                as: 'profileDetails'
                            }
                        },
                        {
                            $unwind: {
                                path: '$profileDetails',
                                preserveNullAndEmptyArrays: true // In case user has no profile
                            }
                        }
                    ]
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    description: 1,
                    contentType: 1,
                    contentUrl: 1,
                    user: {
                        _id: 1,
                        username: 1,
                        firstName: 1,
                        otherName: 1,
                        email: 1,
                        profile: '$user.profileDetails' // Get the populated profile
                    },
                    likes: 1,
                    comments: 1,
                    bookmarks: 1,
                    createdAt: 1
                }
            }
        ]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await postModel.find({ user: userId })
            .populate({
                path: 'user',
                select: 'username email firstName otherName',
                populate: {
                    path: 'profile',
                    model: 'Profile'
                }
            });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { description, contentType } = req.body;
        const contentUrl = req.file ? req.file.path : null;

        const updatedData = {
            description,
            contentType
        };

        if (contentUrl) updatedData.contentUrl = contentUrl;

        const post = await postModel.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate('user');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.likes) post.likes = [];
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }

        post.likes.push(req.user._id);
        await post.save();

        const notification = new notificationModel({
            user: post.user._id,
            type: 'like',
            content: `${req.user.username} liked your post`,
            post: post._id
        });

        await notification.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const unlikePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.likes.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have not liked this post' });
        }

        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const commentPost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate('user');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text
        };
        post.comments.push(comment);
        await post.save();

        const notification = new notificationModel({
            user: post.user._id,
            type: 'comment',
            content: `${req.user.username} commented on your post`,
            post: post._id
        });

        await notification.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllComments = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate('comments.user', 'username email');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post.comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const replyComment = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id).populate('user');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        const reply = {
            user: req.user._id,
            text: req.body.text
        };
        comment.replies.push(reply);
        await post.save();

        const notification = new notificationModel({
            user: post.user._id,
            type: 'reply',
            content: `${req.user.username} replied to your comment`,
            post: post._id
        });

        await notification.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const mentionUser = async (req, res) => {
    try {
        const { postId, mentionedUserId } = req.body;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const notification = new notificationModel({
            user: mentionedUserId,
            type: 'mention',
            content: `${req.user.username} mentioned you in a post`,
            post: post._id
        });

        await notification.save();

        res.status(200).json({ message: 'User mentioned successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const bookmarkPost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.bookmarks) post.bookmarks = [];
        if (post.bookmarks.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have already bookmarked this post' });
        }

        post.bookmarks.push(req.user._id);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




const unbookmarkPost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.bookmarks.includes(req.user._id)) {
            return res.status(400).json({ error: 'You have not bookmarked this post' });
        }

        post.bookmarks = post.bookmarks.filter(id => id.toString() !== req.user._id.toString());
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getAllBookmarks = async (req, res) => {
    try {
        const posts = await postModel.find({ bookmarks: req.user._id }).populate('user', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    commentPost,
    getPostsByUser,
    mentionUser,
    bookmarkPost,
    unbookmarkPost,
    getAllBookmarks,
    getAllComments,
    replyComment
};