const express = require('express');
const Publication = require('../models/Publication');
const router = express.Router();

// Get all publications (public)
router.get('/', async (req, res) => {
  try {
    const { type, year, page = 1, limit = 10 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (year) query.year = parseInt(year);
    const publications = await Publication.find({ ...query, isPublished: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Publication.countDocuments(query);
    res.json({
      success: true,
      publications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get latest publications (public)
router.get('/latest', async (req, res) => {
  try {
    const publications = await Publication.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ success: true, publications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single publication (public)
router.get('/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ success: false, error: 'Publication not found' });
    }
    res.json({ success: true, publication });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
