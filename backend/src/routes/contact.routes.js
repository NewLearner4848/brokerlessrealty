const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contact.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', createContact);
router.get('/', protect, getContacts);

module.exports = router;
