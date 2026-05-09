const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (username, password) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        return { token, username: user.username };
    } catch (err) {
        throw err;
    }
};

module.exports = { loginUser };
