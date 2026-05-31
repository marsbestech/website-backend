const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');

// Base API route
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Proxy for FormSubmit to avoid CORS issues
router.post('/contact', async (req, res) => {
    try {
        const response = await fetch('https://formsubmit.co/ajax/info@marsbestech.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error forwarding to FormSubmit:', error);
        res.status(500).json({ success: false, message: 'Failed to send message: ' + error.message });
    }
});

// Mount modular routes
router.use('/', authRoutes); // mounts /api/login
router.use('/posts', postRoutes); // mounts /api/posts

module.exports = router;
