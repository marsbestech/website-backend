require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/index');

const app = express();

// Lock CORS to your React domain
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://marsbestech.com',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount the modular routes at /api
app.use('/api', apiRoutes);

module.exports = app;