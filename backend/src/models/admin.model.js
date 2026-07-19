const pool = require('../config/db');

class AdminModel {
  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
  }

  static async updatePassword(username, passwordHash) {
    const [result] = await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    return result;
  }
}

module.exports = AdminModel;

