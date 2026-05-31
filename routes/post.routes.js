const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute path to uploads dir — works regardless of where Node is launched from
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
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

// Multer error handler — returns a clear 400 instead of crashing with 500
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

module.exports = router;
