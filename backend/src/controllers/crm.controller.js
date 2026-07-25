const ContactModel = require('../models/contact.model');
const RentInquiryModel = require('../models/rent_inquiry.model');
const SubscriberModel = require('../models/subscriber.model');
const PropertyModel = require('../models/property.model');

// @desc Get all contact leads for CRM
const getLeads = async (req, res) => {
  try {
    const leads = await ContactModel.findAll();
    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('CRM Get Leads Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

// @desc Get all rent inquiries for CRM
const getRentInquiries = async (req, res) => {
  try {
    const inquiries = await RentInquiryModel.findAll();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('CRM Get Rent Inquiries Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rent inquiries' });
  }
};

// @desc Get all subscribers for CRM
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await SubscriberModel.findAll();
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    console.error('CRM Get Subscribers Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
};

// @desc Get all properties for CRM
const getProperties = async (req, res) => {
  try {
    const properties = await PropertyModel.findAll();
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    console.error('CRM Get Properties Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
};

// @desc Get unified CRM data payload (leads, inquiries, subscribers, properties)
const getAllCrmData = async (req, res) => {
  try {
    const [leads, inquiries, subscribers, properties] = await Promise.all([
      ContactModel.findAll(),
      RentInquiryModel.findAll(),
      SubscriberModel.findAll(),
      PropertyModel.findAll()
    ]);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalLeads: leads.length,
        totalRentInquiries: inquiries.length,
        totalSubscribers: subscribers.length,
        totalProperties: properties.length
      },
      data: {
        leads,
        rentInquiries: inquiries,
        subscribers,
        properties
      }
    });
  } catch (error) {
    console.error('CRM Get All Data Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unified CRM data' });
  }
};

module.exports = {
  getLeads,
  getRentInquiries,
  getSubscribers,
  getProperties,
  getAllCrmData
};
