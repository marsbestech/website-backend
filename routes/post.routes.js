const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticateToken, upload.single('image'), postController.createPost);
router.put('/:id', authenticateToken, upload.single('image'), postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
