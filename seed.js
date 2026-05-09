const bcrypt = require('bcryptjs');
const db = require('./db'); // Require db.js to ensure connection and table creation happens first

const seedDatabase = async () => {
    // Wait a brief moment to ensure db.js has finished creating tables asynchronously
    setTimeout(async () => {
        try {
            // Insert Admin User
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync('admin123', salt);
            
            await db.query(
                `INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
                ['admin', hash]
            );
            console.log("Admin user checked/created (admin / admin123)");

            // Insert dummy posts if none exist
            const dummyPosts = [
                {
                    title: 'The Future of ERPs in Ethiopian Enterprises',
                    excerpt: 'Discover how modern, cloud-based ERP systems are transforming the way businesses operate in East Africa.',
                    content: '<p>Discover how modern, cloud-based ERP systems are transforming the way businesses operate in East Africa.</p><p>Many enterprises are moving to Odoo for its flexibility.</p>',
                    category: 'ERP Solutions',
                    author: 'Marsbes Tech',
                    date: 'May 1, 2024',
                    readTime: '5 min read'
                },
                {
                    title: 'AI in African Business: Beyond the Hype',
                    excerpt: 'Practical applications of Artificial Intelligence that are already generating ROI for local businesses today.',
                    content: '<p>Practical applications of Artificial Intelligence that are already generating ROI for local businesses today.</p>',
                    category: 'Artificial Intelligence',
                    author: 'Marsbes Tech',
                    date: 'April 24, 2024',
                    readTime: '8 min read'
                }
            ];

            const result = await db.query("SELECT COUNT(*) AS count FROM posts");
            const count = parseInt(result.rows[0].count, 10);
            
            if (count === 0) {
                const query = `INSERT INTO posts (title, excerpt, content, category, author, date, "readTime") VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                
                for (const post of dummyPosts) {
                    await db.query(query, [
                        post.title, post.excerpt, post.content, post.category, post.author, post.date, post.readTime
                    ]);
                }
                console.log("Dummy posts seeded.");
            } else {
                console.log("Posts already exist. Skipping seed.");
            }
        } catch (err) {
            console.error("Error during seeding:", err);
        } finally {
            db.end(); // close the pool since this is just a seed script
        }
    }, 1000); // 1 second delay
};

seedDatabase();
