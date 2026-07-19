
const express = require('express');
const router = express.Router();

const contactRoutes = require('./contact.routes');
const authRoutes = require('./auth.routes');
const settingsRoutes = require('./settings.routes');
const propertyRoutes = require('./property.routes');
const subscriberRoutes = require('./subscriber.routes');
const rentInquiryRoutes = require('./rent_inquiry.routes');

router.use('/contact', contactRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/properties', propertyRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/rent-inquiries', rentInquiryRoutes);

module.exports = router;