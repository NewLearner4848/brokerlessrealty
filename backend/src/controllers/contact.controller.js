

const ContactModel = require('../models/contact.model');
const { sendContactNotification } = require('../services/email.service');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const newContact = await ContactModel.create({ name, email, phone, message });
    
    // Asynchronously send email notification and don't block the API response.
    // Log errors on the server if email sending fails.
    sendContactNotification(newContact).catch(console.error);

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.findAll();
    res.json(contacts);
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ message: 'Server error while fetching contacts' });
  }
};

module.exports = {
  createContact,
  getContacts,
};