const multer = require('multer');
const { imageStorage, pdfStorage } = require('../config/cloudinary');

// Middleware for Image uploads
const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for images
});

// Middleware for PDF uploads
const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for PDFs
});

module.exports = {
  upload,
  uploadPdf
};
