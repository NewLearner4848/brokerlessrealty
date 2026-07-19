const RentInquiryModel = require('../models/rent_inquiry.model');
const { sendRentInquiryNotification } = require('../services/email.service');

const createRentInquiry = async (req, res) => {
  try {
    const newInquiry = await RentInquiryModel.create(req.body);
    
    // Asynchronously send email notification
    sendRentInquiryNotification(newInquiry).catch(console.error);

    res.status(201).json({ message: 'Inquiry submitted successfully!' });
  } catch (error) {
    console.error('Create Rent Inquiry Error:', error);
    res.status(500).json({ message: 'Server error while submitting inquiry' });
  }
};

const getRentInquiries = async (req, res) => {
  try {
    const inquiries = await RentInquiryModel.findAll();
    res.json(inquiries);
  } catch (error) {
    console.error('Get Rent Inquiries Error:', error);
    res.status(500).json({ message: 'Server error while fetching inquiries' });
  }
};

module.exports = {
  createRentInquiry,
  getRentInquiries,
};
