const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactMessage = new ContactMessage({ name, email, subject, message });
    await contactMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
