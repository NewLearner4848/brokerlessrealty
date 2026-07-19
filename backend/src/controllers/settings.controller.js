
const SettingsModel = require('../models/settings.model');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    const settings = await SettingsModel.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
};

// @desc    Update settings
// @route   POST /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    // Basic validation to ensure we only process expected keys
    const allowedKeys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'receiver_email'];
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

module.exports = {
  getSettings,
  updateSettings,
};
