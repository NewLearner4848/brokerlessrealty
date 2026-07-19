const pool = require('../config/db');

class ContactModel {
  static async create({ name, email, phone, message }) {
    const [result] = await pool.query(
      'INSERT INTO contacts (name, email, phone_number, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    );
    return { id: result.insertId, name, email, phone, message };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  }
}

module.exports = ContactModel;