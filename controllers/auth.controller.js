const authService = require('../services/auth.service');

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await authService.loginUser(username, password);
        res.json(result);
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const result = await authService.registerUser(username, password);
        res.status(201).json(result);
    } catch (err) {
        if (err.message === 'Username already exists') {
            return res.status(409).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { login, register, getAllUsers };
