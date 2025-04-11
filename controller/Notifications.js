



const newUserRegistrationNotification = async (user) => {
    try {
        const notification = {
            user: user._id,
            type: 'newUser',
            content: `${user.name} has joined the platform.`,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating new user registration notification:', error);
        throw error;
    }
}

const groupJoinNotification = async (user, group) => {
    try {
        const notification = {
            user: user._id,
            type: 'groupJoin',
            content: `${user.name} has joined the group ${group.name}.`,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating group join notification:', error);
        throw error;
    }
}


const groupNotification = async (user, group) => {
    try {
        const notification = {
            user: user._id,
            type: 'group',
            content: `${user.name} has created the group ${group.name}.`,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating group notification:', error);
        throw error;
    }
}


const postNotification = async (user, post) => {
    try {
        const notification = {
            user: user._id,
            type: 'post',
            content: `${user.name} has created a new post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating post notification:', error);
        throw error;
    }
}



const likeNotification = async (user, post) => {
    try {
        const notification = {
            user: user._id,
            type: 'like',
            content: `${user.name} liked your post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating like notification:', error);
        throw error;
    }
}


const commentNotification = async (user, post) => {
    try {
        const notification = {
            user: user._id,
            type: 'comment',
            content: `${user.name} commented on your post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating comment notification:', error);
        throw error;
    }
}


const mentionNotification = async (user, post) => {
    try {
        const notification = {
            user: user._id,
            type: 'mention',
            content: `${user.name} mentioned you in a post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating mention notification:', error);
        throw error;
    }
}




const followNotification = async (user) => {
    try {
        const notification = {
            user: user._id,
            type: 'follow',
            content: `${user.name} started following you.`,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating follow notification:', error);
        throw error;
    }
}


const reportNotification = async (user, post) => {
    try {
        const notification = {
            user: user._id,
            type: 'report',
            content: `${user.name} reported your post.`,
            post: post._id,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating report notification:', error);
        throw error;
    }
}


const reportUser = async (user) => {
    try {
        const notification = {
            user: user._id,
            type: 'report',
            content: `${user.name} reported you.`,
            createdAt: new Date(),
            read: false
        };
        return notification;
    } catch (error) {
        console.error('Error creating report notification:', error);
        throw error;
    }
}