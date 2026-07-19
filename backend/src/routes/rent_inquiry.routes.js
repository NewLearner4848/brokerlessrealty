const express = require('express');
const router = express.Router();
const { createRentInquiry, getRentInquiries } = require('../controllers/rent_inquiry.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', createRentInquiry);
router.get('/', protect, getRentInquiries);

module.exports = router;
