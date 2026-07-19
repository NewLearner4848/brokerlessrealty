
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getSettings);
router.post('/', protect, updateSettings);

module.exports = router;
