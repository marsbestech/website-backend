const postService = require('../services/post.service');

const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createPost = async (req, res) => {
    try {
        const postData = { ...req.body };
        if (req.file) {
            postData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const newPost = await postService.createPost(postData);
        res.json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const postData = { ...req.body };
        if (req.file) {
            postData.imageUrl = `/uploads/${req.file.filename}`;
        }
        const updatedPost = await postService.updatePost(req.params.id, postData);
        if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const success = await postService.deletePost(req.params.id);
        if (!success) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
