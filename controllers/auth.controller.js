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

module.exports = { login };
