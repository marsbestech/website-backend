const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/users', authenticateToken, authController.getAllUsers);

module.exports = router;
