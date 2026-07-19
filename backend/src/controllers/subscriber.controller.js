
const SubscriberModel = require('../models/subscriber.model');

const createSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const existingSubscriber = await SubscriberModel.findByEmail(email);
    if (existingSubscriber) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    await SubscriberModel.create(email);
    res.status(201).json({ message: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Create Subscriber Error:', error);
    res.status(500).json({ message: 'Server error while subscribing.' });
  }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await SubscriberModel.findAll();
        res.json(subscribers);
    } catch (error) {
        console.error('Get Subscribers Error:', error);
        res.status(500).json({ message: 'Server error while fetching subscribers.' });
    }
};

module.exports = {
  createSubscriber,
  getSubscribers,
};
