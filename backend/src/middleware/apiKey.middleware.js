const ApiKeyService = require('../services/apiKey.service');

/**
 * Middleware to authenticate requests via API Key.
 * Accepts key from x-api-key header, Authorization header (Bearer or ApiKey), or ?api_key query param.
 */
const apiKeyAuth = async (req, res, next) => {
  try {
    let apiKey = req.headers['x-api-key'];

    if (!apiKey && req.headers['authorization']) {
      const parts = req.headers['authorization'].split(' ');
      if (parts.length === 2 && (parts[0] === 'Bearer' || parts[0] === 'ApiKey')) {
        apiKey = parts[1];
      }
    }

    if (!apiKey && (req.query.api_key || req.query.apiKey)) {
      apiKey = req.query.api_key || req.query.apiKey;
    }

    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing API Key. Please provide an x-api-key header or ?api_key= query parameter.'
      });
    }

    const isValid = await ApiKeyService.validateApiKey(apiKey);
    if (!isValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API Key provided. Please check your CRM credentials in the Admin Panel.'
      });
    }

    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({ message: 'Server error during API Key authentication' });
  }
};

module.exports = apiKeyAuth;
