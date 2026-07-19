const pool = require('../config/db');

class RentInquiryModel {
  static async create(inquiryData) {
    const {
      userType,
      fullName,
      mobileNumber,
      email,
      locationPreference,
      budget,
      timeline,
      propertyType,
      propertyAddress,
      areaSqft,
      furnishingStatus,
      availableFrom,
      configuration,
      furnishingPreference,
    } = inquiryData;

    const [result] = await pool.query(
      `INSERT INTO rent_inquiries (user_type, full_name, mobile_number, email, location_preference, budget, timeline, property_type, property_address, area_sqft, furnishing_status, available_from, configuration, furnishing_preference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userType,
        fullName,
        mobileNumber,
        email || null,
        locationPreference,
        budget,
        timeline,
        propertyType || null,
        propertyAddress || null,
        areaSqft || null,
        furnishingStatus || null,
        availableFrom || null,
        configuration || null,
        furnishingPreference || null,
      ]
    );
    return { id: result.insertId, ...inquiryData };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM rent_inquiries ORDER BY created_at DESC');
    return rows;
  }
}

module.exports = RentInquiryModel;
