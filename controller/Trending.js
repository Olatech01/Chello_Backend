const userModel = require("../models/Auth");
const groupModel = require("../models/Group");
const postModel = require("../models/Post");





const getTrendingTopics = async (req, res) => {
    try {
        const trendingTopics = await postModel.aggregate([
            {
                $match: { description: { $regex: /#\w+/g } }
            },
            {
                $project: {
                    hashtags: {
                        $regexFindAll: { input: "$description", regex: /#\w+/g }
                    }
                }
            },
            { $unwind: "$hashtags" }, 
            {
                $group: {
                    _id: "$hashtags.match", 
                    count: { $sum: 1 } 
                }
            },
            { $sort: { count: -1 } }, 
            { $limit: 10 }
        ]);

        res.status(200).json(trendingTopics);
    } catch (error) {
        console.error("Error fetching trending topics:", error);
        res.status(500).json({ error: "Failed to fetch trending topics" });
    }
};


const getTrendingUsers = async (req, res) => {
    try {
        const trendingUsers = await userModel.aggregate([
            {
                $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                    followersCount: { $size: "$followers" } 
                }
            },
            { $sort: { followersCount: -1 } }, 
            { $limit: 10 }
        ]);

        res.status(200).json(trendingUsers);
    } catch (error) {
        console.error("Error fetching trending users:", error);
        res.status(500).json({ error: "Failed to fetch trending users" });
    }
};


const getTrendingPosts = async (req, res) => {
    try {
        const trendingPosts = await postModel.aggregate([
            {
                $match: { likesCount: { $gt: 0 } } 
            },
            {
                $sort: { likesCount: -1 } 
            },
            { $limit: 10 }
        ]);

        res.status(200).json(trendingPosts);
    } catch (error) {
        console.error("Error fetching trending posts:", error);
        res.status(500).json({ error: "Failed to fetch trending posts" });
    }
};


const getTrendingGroups = async (req, res) => {
    try {
        const trendingGroups = await groupModel.aggregate([
            {
                $project: {
                    name: 1,
                    description: 1,
                    membersCount: { $size: "$members" } 
                }
            },
            { $sort: { membersCount: -1 } }, 
            { $limit: 10 }
        ]);

        res.status(200).json(trendingGroups);
    } catch (error) {
        console.error("Error fetching trending groups:", error);
        res.status(500).json({ error: "Failed to fetch trending groups" });
    }
};


const getTrending = async (req, res) => {
    try {
        const trendingTopics = await getTrendingTopics(req, res);
        const trendingUsers = await getTrendingUsers(req, res);
        const trendingPosts = await getTrendingPosts(req, res);
        const trendingGroups = await getTrendingGroups(req, res);

        res.status(200).json({
            trendingTopics,
            trendingUsers,
            trendingPosts,
            trendingGroups
        });
    } catch (error) {
        console.error("Error fetching trending data:", error);
        res.status(500).json({ error: "Failed to fetch trending data" });
    }
};


module.exports = {
    getTrendingTopics,
    getTrendingUsers,
    getTrendingPosts,
    getTrendingGroups,
    getTrending
};