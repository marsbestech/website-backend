const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');

// Base API route
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});
app.get('/version-test', (req, res) => {
    res.send('NEW VERSION LIVE');
});

// Mount modular routes
router.use('/', authRoutes); // mounts /api/login
router.use('/posts', postRoutes); // mounts /api/posts

module.exports = router;
