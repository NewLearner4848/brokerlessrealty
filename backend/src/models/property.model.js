const pool = require('../config/db');

const parseProperty = (property) => {
    if (!property) return null;
    const newProp = { ...property };
    if (newProp.hasOwnProperty('isFeatured')) {
        newProp.isFeatured = !!newProp.isFeatured;
    }
    try {
        if (typeof newProp.features === 'string') {
            newProp.features = JSON.parse(newProp.features);
        }
    } catch (e) {
        console.error(`Failed to parse features for property ${newProp.id}:`, e);
        newProp.features = []; // Default to empty array on error
    }
    try {
        if (typeof newProp.images === 'string') {
            newProp.images = JSON.parse(newProp.images);
        }
    } catch (e) {
        console.error(`Failed to parse images for property ${newProp.id}:`, e);
        newProp.images = []; // Default to empty array on error
    }
    return newProp;
};

class PropertyModel {
    static async findAll(filters = {}) {
        let query = 'SELECT id, title, description, price, original_price as originalPrice, savings_text as savingsText, address, city, type, bedrooms, bathrooms, area, features, images, is_featured AS isFeatured, created_at, updated_at FROM properties';
        const queryParams = [];

        if (filters.featured) {
            query += ' WHERE is_featured = ?';
            queryParams.push(true);
        }

        query += ' ORDER BY updated_at DESC';

        const [rows] = await pool.query(query, queryParams);
        return rows.map(parseProperty);
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT id, title, description, price, original_price as originalPrice, savings_text as savingsText, address, city, type, bedrooms, bathrooms, area, features, images, is_featured AS isFeatured, created_at, updated_at FROM properties WHERE id = ?', [id]);
        return parseProperty(rows[0]);
    }

    static async create(propertyData) {
        const { title, description, price, originalPrice, savingsText, address, city, type, bedrooms, bathrooms, area, features, images, isFeatured } = propertyData;
        const [result] = await pool.query(
            'INSERT INTO properties (title, description, price, original_price, savings_text, address, city, type, bedrooms, bathrooms, area, features, images, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, originalPrice, savingsText, address, city, type, bedrooms, bathrooms, area, JSON.stringify(features || []), JSON.stringify(images || []), isFeatured === 'true']
        );
        return { id: result.insertId, ...propertyData };
    }

    static async update(id, propertyData) {
        const { title, description, price, originalPrice, savingsText, address, city, type, bedrooms, bathrooms, area, features, images, isFeatured } = propertyData;
        await pool.query(
            'UPDATE properties SET title = ?, description = ?, price = ?, original_price = ?, savings_text = ?, address = ?, city = ?, type = ?, bedrooms = ?, bathrooms = ?, area = ?, features = ?, images = ?, is_featured = ? WHERE id = ?',
            [title, description, price, originalPrice, savingsText, address, city, type, bedrooms, bathrooms, area, JSON.stringify(features || []), JSON.stringify(images || []), isFeatured === 'true', id]
        );
        return { id, ...propertyData };
    }

    static async remove(id) {
        const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = PropertyModel;