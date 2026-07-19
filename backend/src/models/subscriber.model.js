
const pool = require('../config/db');

class SubscriberModel {
  static async create(email) {
    const [result] = await pool.query('INSERT INTO subscribers (email) VALUES (?)', [email]);
    return { id: result.insertId, email };
  }
  
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM subscribers WHERE email = ?', [email]);
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM subscribers ORDER BY created_at DESC');
    return rows;
  }
}

module.exports = SubscriberModel;
