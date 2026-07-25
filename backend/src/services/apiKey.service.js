const crypto = require('crypto');
const SettingsModel = require('../models/settings.model');

class ApiKeyService {
  /**
   * Get current API Key or generate a new default key if missing.
   * @returns {Promise<string>}
   */
  static async getOrGenerateApiKey() {
    const settings = await SettingsModel.getSettings();
    if (settings.api_key && settings.api_key.trim() !== '') {
      return settings.api_key;
    }

    const newKey = this.generateRandomKey();
    await SettingsModel.updateSettings({ api_key: newKey });
    return newKey;
  }

  /**
   * Regenerate a brand new API Key and save to DB.
   * @returns {Promise<string>}
   */
  static async regenerateApiKey() {
    const newKey = this.generateRandomKey();
    await SettingsModel.updateSettings({ api_key: newKey });
    return newKey;
  }

  /**
   * Validate provided API Key against stored key.
   * @param {string} providedKey
   * @returns {Promise<boolean>}
   */
  static async validateApiKey(providedKey) {
    if (!providedKey) return false;
    const currentKey = await this.getOrGenerateApiKey();
    return providedKey.trim() === currentKey.trim();
  }

  /**
   * Helper to generate a secure random API key.
   */
  static generateRandomKey() {
    return 'bk_live_' + crypto.randomBytes(16).toString('hex');
  }
}

module.exports = ApiKeyService;
