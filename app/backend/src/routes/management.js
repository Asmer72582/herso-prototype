const express = require('express');
const router = express.Router();
const ManagementMember = require('../models/ManagementMember');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/management
// @desc    Get all management members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const members = await ManagementMember.find().sort({ order: 1 });
    res.json({ success: true, members });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/management
// @desc    Add a new management member
// @access  Private/Admin
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, designation, order } = req.body;
    const member = new ManagementMember({ name, designation, order });
    await member.save();
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/management/:id
// @desc    Update a management member
// @access  Private/Admin
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, designation, order } = req.body;
    const member = await ManagementMember.findByIdAndUpdate(
      req.params.id,
      { name, designation, order },
      { new: true }
    );
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/management/:id
// @desc    Delete a management member
// @access  Private/Admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await ManagementMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
