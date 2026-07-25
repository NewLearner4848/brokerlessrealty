const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKey.middleware');
const {
  getLeads,
  getRentInquiries,
  getSubscribers,
  getProperties,
  getAllCrmData
} = require('../controllers/crm.controller');

// All CRM endpoints require valid API Key authentication
router.use(apiKeyAuth);

router.get('/all', getAllCrmData);
router.get('/leads', getLeads);
router.get('/rent-inquiries', getRentInquiries);
router.get('/subscribers', getSubscribers);
router.get('/properties', getProperties);

module.exports = router;
