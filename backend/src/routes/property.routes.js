
const express = require('express');
const router = express.Router();
const {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} = require('../controllers/property.controller');
const { protect } = require('../middleware/auth.middleware');
const handleUpload = require('../middleware/upload.middleware');

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected admin routes
router.post('/', protect, handleUpload, createProperty);
router.put('/:id', protect, handleUpload, updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;