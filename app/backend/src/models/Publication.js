const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: String }],
  abstract: { type: String },
  keywords: [{ type: String }],
  pdfUrl: { type: String },
  pages: { type: String }
});

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  volume: { type: String },
  issue: { type: String },
  month: { type: String },
  year: { type: Number },
  type: { type: String, enum: ['online', 'print'], default: 'online' },
  description: { type: String },
  coverImage: { type: String },
  pdfUrl: { type: String },
  articles: [articleSchema],
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
