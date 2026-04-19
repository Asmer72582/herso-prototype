const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category, year } = req.query;
    const query = {};
    if (category) query.category = category;
    if (year) query.eventYear = parseInt(year);
    const images = await GalleryImage.find(query).sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single gallery image (public)
router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
