const express = require('express');
const cors = require('cors');
const path = require('path');
const mainRouter = require('./routes'); // Main router from src/routes/index.js
const { generateSitemap } = require('./controllers/sitemap.controller');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic Sitemap endpoint
app.get('/sitemap.xml', generateSitemap);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Main API Router
app.use('/api', mainRouter);

module.exports = app;