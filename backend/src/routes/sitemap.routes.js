const express = require('express');
const router = express.Router();
const { generateSitemap } = require('../controllers/sitemap.controller');

router.get('/', generateSitemap);

module.exports = router;
