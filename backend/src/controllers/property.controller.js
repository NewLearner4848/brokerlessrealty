
const PropertyModel = require('../models/property.model');

// @desc    Get all properties (public)
const getAllProperties = async (req, res) => {
    try {
        const filters = {};
        if (req.query.featured === 'true') {
            filters.featured = true;
        }
        const properties = await PropertyModel.findAll(filters);
        res.json(properties);
    } catch (error) {
        console.error('Get All Properties Error:', error);
        res.status(500).json({ message: 'Server error while fetching properties' });
    }
};

// @desc    Get single property by ID (public)
const getPropertyById = async (req, res) => {
    try {
        const property = await PropertyModel.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        console.error('Get Property By ID Error:', error);
        res.status(500).json({ message: 'Server error while fetching property' });
    }
};

// @desc    Create a new property (private/admin)
const createProperty = async (req, res) => {
    try {
        const propertyData = { ...req.body };
        
        // Handle images from upload
        if (req.files && req.files.length > 0) {
            propertyData.images = req.files.map(file => `/uploads/${file.filename}`);
        } else {
            propertyData.images = [];
        }

        // Handle features (sent as comma-separated string)
        if (typeof propertyData.features === 'string') {
            propertyData.features = propertyData.features.split(',').map(item => item.trim()).filter(Boolean);
        } else {
            propertyData.features = [];
        }
        
        const newProperty = await PropertyModel.create(propertyData);
        res.status(201).json(newProperty);
    } catch (error) {
        console.error('Create Property Error:', error);
        res.status(500).json({ message: 'Server error while creating property' });
    }
};

// @desc    Update a property (private/admin)
const updateProperty = async (req, res) => {
    try {
        const propertyData = { ...req.body };

        // If new files were uploaded, they take precedence
        if (req.files && req.files.length > 0) {
            // TODO: In a real app, delete old images from storage
            propertyData.images = req.files.map(file => `/uploads/${file.filename}`);
        } else if (req.body.images && typeof req.body.images === 'string') {
            // Otherwise, check for the stringified array of existing images
            try {
                const parsedImages = JSON.parse(req.body.images);
                 if (Array.isArray(parsedImages) && parsedImages.every(item => typeof item === 'string')) {
                    propertyData.images = parsedImages;
                } else {
                    propertyData.images = [];
                }
            } catch (e) {
                propertyData.images = []; // if parsing fails, default to empty
            }
        } else {
            // If no images field at all, prevent wiping existing data
             const existingProperty = await PropertyModel.findById(req.params.id);
             propertyData.images = existingProperty ? existingProperty.images : [];
        }

        // Handle features (sent as comma-separated string)
        if (typeof propertyData.features === 'string') {
            propertyData.features = propertyData.features.split(',').map(item => item.trim()).filter(Boolean);
        } else {
            // If features field is missing, prevent wiping existing data
            const existingProperty = await PropertyModel.findById(req.params.id);
            propertyData.features = existingProperty ? existingProperty.features : [];
        }

        const updatedProperty = await PropertyModel.update(req.params.id, propertyData);
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(updatedProperty);
    } catch (error) {
        console.error('Update Property Error:', error);
        res.status(500).json({ message: 'Server error while updating property' });
    }
};

// @desc    Delete a property (private/admin)
const deleteProperty = async (req, res) => {
    try {
        const affectedRows = await PropertyModel.remove(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Delete Property Error:', error);
        res.status(500).json({ message: 'Server error while deleting property' });
    }
};

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};