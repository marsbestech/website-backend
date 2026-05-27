const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to the PostgreSQL database.');

    try {
        await client.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);

        await client.query(`CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            excerpt TEXT,
            content TEXT,
            category VARCHAR(100),
            author VARCHAR(100),
            date VARCHAR(100),
            "readTime" VARCHAR(100),
            "imageUrl" VARCHAR(255)
        )`);
    } catch (err) {
        console.error('Error creating tables', err.stack);
    } finally {
        release();
    }
});

module.exports = pool;