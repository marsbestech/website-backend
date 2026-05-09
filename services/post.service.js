const db = require('../db');

const getAllPosts = async () => {
    const result = await db.query(`SELECT * FROM posts ORDER BY id DESC`);
    return result.rows;
};

const getPostById = async (id) => {
    const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [id]);
    return result.rows[0];
};

const createPost = async (postData) => {
    const { title, excerpt, content, category, author, date, readTime, imageUrl } = postData;
    const query = `INSERT INTO posts (title, excerpt, content, category, author, date, "readTime", "imageUrl") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    const result = await db.query(query, [title, excerpt, content, category, author, date, readTime, imageUrl || null]);
    return { id: result.rows[0].id, ...postData };
};

const updatePost = async (id, postData) => {
    const { title, excerpt, content, category, author, date, readTime, imageUrl } = postData;
    let query, params;
    
    if (imageUrl) {
        query = `UPDATE posts SET title = $1, excerpt = $2, content = $3, category = $4, author = $5, date = $6, "readTime" = $7, "imageUrl" = $8 WHERE id = $9 RETURNING id`;
        params = [title, excerpt, content, category, author, date, readTime, imageUrl, id];
    } else {
        query = `UPDATE posts SET title = $1, excerpt = $2, content = $3, category = $4, author = $5, date = $6, "readTime" = $7 WHERE id = $8 RETURNING id`;
        params = [title, excerpt, content, category, author, date, readTime, id];
    }
    
    const result = await db.query(query, params);
    if (result.rowCount === 0) return null;
    return { id, ...postData };
};

const deletePost = async (id) => {
    const result = await db.query(`DELETE FROM posts WHERE id = $1`, [id]);
    return result.rowCount > 0;
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
