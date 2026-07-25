const SettingsModel = require('../models/settings.model');
const ApiKeyService = require('../services/apiKey.service');

// @desc    Get all settings (including API Key)
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    const apiKey = await ApiKeyService.getOrGenerateApiKey();
    res.json({ ...settings, api_key: apiKey });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
};

// @desc    Update SMTP and general settings
// @route   POST /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const allowedKeys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'receiver_email', 'api_key'];
    const settingsToUpdate = {};
    for (const key of allowedKeys) {
        if (req.body.hasOwnProperty(key)) {
            settingsToUpdate[key] = req.body[key];
        }
    }

    if (Object.keys(settingsToUpdate).length === 0) {
        return res.status(400).json({ message: 'No valid settings provided.' });
    }

    await SettingsModel.updateSettings(settingsToUpdate);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
};

// @desc    Regenerate API Key
// @route   POST /api/settings/api-key/regenerate
// @access  Private/Admin
const regenerateApiKey = async (req, res) => {
  try {
    const newKey = await ApiKeyService.regenerateApiKey();
    res.json({ success: true, api_key: newKey, message: 'API Key regenerated successfully!' });
  } catch (error) {
    console.error('Regenerate API Key Error:', error);
    res.status(500).json({ message: 'Failed to regenerate API Key' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  regenerateApiKey
};
