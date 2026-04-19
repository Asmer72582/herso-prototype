const express = require('express');
const HeroSlide = require('../models/HeroSlide');
const router = express.Router();

// Get all hero slides (public)
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json({ success: true, slides });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
