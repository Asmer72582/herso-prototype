const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'herso/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Storage for PDFs (Raw files)
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'herso/pdfs',
    resource_type: 'raw',
    format: 'pdf',
  }
});

module.exports = {
  cloudinary,
  imageStorage,
  pdfStorage
};
