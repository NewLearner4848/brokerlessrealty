const express = require('express');
const router = express.Router();
const { loginAdmin, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

