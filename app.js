require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/index');

const app = express();

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(o => o.trim())
    : ['https://marsbestech.com', 'https://www.marsbestech.com'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true
}));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root health check route
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Marsbes Tech API is running' });
});
app.get('/version-test', (req, res) => {
    console.log('Version test endpoint hit');
    res.json({ status: 'ok', message: 'version updated' });
});
// API routes
app.use('/api', apiRoutes);

// For local development: listen on PORT
if (!module.parent) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Passenger (cPanel)
module.exports = app;
