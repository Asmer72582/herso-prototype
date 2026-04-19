const express = require('express');
const Publication = require('../models/Publication');
const Announcement = require('../models/Announcement');
const GalleryImage = require('../models/GalleryImage');
const HeroSlide = require('../models/HeroSlide');
const ContactMessage = require('../models/ContactMessage');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// ===== FILE UPLOAD =====
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== PUBLICATIONS =====
router.post('/publications', async (req, res) => {
  try {
    const pub = new Publication(req.body);
    await pub.save();
    res.status(201).json({ success: true, publication: pub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/publications/:id', async (req, res) => {
  try {
    const pub = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pub) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, publication: pub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/publications/:id', async (req, res) => {
  try {
    await Publication.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/publications/:id/articles', async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json({ success: false, error: 'Not found' });
    pub.articles.push(req.body);
    await pub.save();
    res.json({ success: true, publication: pub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/publications/:id/articles/:articleId', async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json({ success: false, error: 'Not found' });
    pub.articles = pub.articles.filter(a => a._id.toString() !== req.params.articleId);
    await pub.save();
    res.json({ success: true, publication: pub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ANNOUNCEMENTS =====
router.post('/announcements', async (req, res) => {
  try {
    const ann = new Announcement(req.body);
    await ann.save();
    res.status(201).json({ success: true, announcement: ann });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/announcements/:id', async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ann) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, announcement: ann });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== GALLERY =====
router.post('/gallery', async (req, res) => {
  try {
    const img = new GalleryImage(req.body);
    await img.save();
    res.status(201).json({ success: true, image: img });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/gallery/:id', async (req, res) => {
  try {
    const img = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!img) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, image: img });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== HERO SLIDER =====
router.get('/hero', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json({ success: true, slides });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/hero', async (req, res) => {
  try {
    const slide = new HeroSlide(req.body);
    await slide.save();
    res.status(201).json({ success: true, slide });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/hero/:id', async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, slide });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/hero/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== CONTACT MESSAGES =====
router.get('/messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== DASHBOARD STATS =====
router.get('/stats', async (req, res) => {
  try {
    const totalPublications = await Publication.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();
    const totalGalleryImages = await GalleryImage.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    const publicationsByYear = await Publication.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject createdAt');
    res.json({
      success: true,
      stats: { totalPublications, totalAnnouncements, totalGalleryImages, totalMessages, publicationsByYear, recentMessages }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
