
const express = require('express');
const router = express.Router();
const { createSubscriber, getSubscribers } = require('../controllers/subscriber.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', createSubscriber);
router.get('/', protect, getSubscribers);

module.exports = router;
