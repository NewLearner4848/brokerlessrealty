
const pool = require('../config/db');

class SettingsModel {
  /**
   * Retrieves all settings and returns them as a key-value object.
   * @returns {Promise<Object>}
   */
  static async getSettings() {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
    const settings = rows.reduce((acc, row) => {
        if (row.setting_value) {
            acc[row.setting_key] = row.setting_value;
        }
        return acc;
    }, {});
    return settings;
  }

  /**
   * Updates multiple settings in a single transaction.
   * @param {Object} settings - An object with setting_key: setting_value pairs.
   * @returns {Promise<void>}
   */
  static async updateSettings(settings) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const queries = Object.entries(settings).map(([key, value]) => {
        return connection.query(
          `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [key, value || ''] // Store empty string instead of null
        );
      });
      await Promise.all(queries);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SettingsModel;
