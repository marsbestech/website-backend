const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');

// Base API route
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

const db = require('../db');
const { authenticateToken } = require('../middleware/auth.middleware');
const nodemailer = require('nodemailer');

// Contact form email submission route using SMTP and Database log
router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validate request body
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // 1. Save to Database first (so message is never lost even if SMTP fails)
        await db.query(
            `INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
            [name, email, subject, message]
        );

        // 2. Send email via SMTP
        let emailSent = false;
        let emailError = null;

        try {
            const isSecure = (process.env.SMTP_PORT === '465');
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'mail.marsbestech.com',
                port: parseInt(process.env.SMTP_PORT) || 465,
                secure: isSecure,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: `"${name}" <${process.env.SMTP_USER}>`,
                replyTo: email,
                to: process.env.SMTP_USER,
                subject: `Contact Form: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <br/>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            emailSent = true;
        } catch (mailErr) {
            console.error('Nodemailer Error:', mailErr);
            emailError = mailErr.message;
        }

        if (emailSent) {
            res.status(200).json({ success: true, message: 'Message sent successfully!' });
        } else {
            // If email failed but DB succeeded, return success but with warning/info so user knows it went through
            res.status(200).json({ 
                success: true, 
                message: 'Message saved to dashboard successfully (email notification delivery failed: ' + emailError + ')'
            });
        }
    } catch (error) {
        console.error('Database/Contact Error:', error);
        res.status(500).json({ success: false, message: 'Failed to save message: ' + error.message });
    }
});

// Get all contact messages (Admin only)
router.get('/contacts', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM contacts ORDER BY created_at DESC`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Delete a contact message (Admin only)
router.delete('/contacts/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(`DELETE FROM contacts WHERE id = $1`, [id]);
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// Mount modular routes
router.use('/', authRoutes); // mounts /api/login
router.use('/posts', postRoutes); // mounts /api/posts

module.exports = router;
