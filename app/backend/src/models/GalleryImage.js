const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['conference', 'workshop', 'seminar', 'other'], default: 'other' },
  eventYear: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
