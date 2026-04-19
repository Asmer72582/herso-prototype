const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/publications', require('./src/routes/publications'));
app.use('/api/announcements', require('./src/routes/announcements'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/hero', require('./src/routes/hero'));
app.use('/api/admin', require('./src/routes/admin'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/herso';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Starting server without database...');
  });

// Seed database with initial data
async function seedDatabase() {
  try {
    const User = require('./src/models/User');
    const Publication = require('./src/models/Publication');
    const Announcement = require('./src/models/Announcement');
    const GalleryImage = require('./src/models/GalleryImage');

    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@herso.org',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Default admin created: admin / admin123');
    }

    // Seed publications if none exist
    const pubCount = await Publication.countDocuments();
    if (pubCount === 0) {
      await Publication.insertMany([
        {
          title: 'JHERS October 2025 Issue',
          volume: 'Vol. 13',
          issue: 'Issue 2',
          month: 'October',
          year: 2025,
          type: 'online',
          description: 'Journal of Higher Education and Research Society - October 2025 issue featuring peer-reviewed articles on contemporary education and research.',
          coverImage: '/journal-cover-1.jpg',
          isPublished: true
        },
        {
          title: 'JHERS April 2025 Issue',
          volume: 'Vol. 13',
          issue: 'Issue 1',
          month: 'April',
          year: 2025,
          type: 'online',
          description: 'Journal of Higher Education and Research Society - April 2025 issue with focus on emerging trends in higher education.',
          coverImage: '/journal-cover-2.jpg',
          isPublished: true
        },
        {
          title: 'JHERS October 2024 Issue',
          volume: 'Vol. 12',
          issue: 'Issue 2',
          month: 'October',
          year: 2024,
          type: 'online',
          description: 'Special issue on sustainable development in higher education and research methodologies.',
          coverImage: '/journal-cover-1.jpg',
          isPublished: true
        },
        {
          title: 'Contemporary Discourse',
          volume: 'Vol. 5',
          issue: 'Issue 1',
          month: 'January',
          year: 2025,
          type: 'print',
          description: 'A journal of humanities and social sciences exploring contemporary cultural and literary discourse.',
          coverImage: '/journal-cover-2.jpg',
          isPublished: true
        },
        {
          title: 'Literary Insight',
          volume: 'Vol. 3',
          issue: 'Issue 2',
          month: 'June',
          year: 2024,
          type: 'print',
          description: 'Peer-reviewed journal focused on literary criticism, theory, and comparative literature studies.',
          coverImage: '/journal-cover-1.jpg',
          isPublished: true
        }
      ]);
      console.log('Sample publications seeded');
    }

    // Seed announcements if none exist
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.insertMany([
        { title: 'JHERS October 2025 Issue Published', content: 'The latest issue of JHERS has been published. Access it online now.', category: 'journal', isActive: true },
        { title: 'JHERS April 2025 Issue Published', content: 'The April 2025 issue is now available for download.', category: 'journal', isActive: true },
        { title: 'International Conference 2025 - Call for Papers', content: 'Submit your research papers for the upcoming international conference.', category: 'event', isActive: true },
        { title: 'New Editorial Board Members Announced', content: 'We welcome new members to our editorial board for 2025-2026.', category: 'general', isActive: true }
      ]);
      console.log('Sample announcements seeded');
    }

    // Seed gallery if none exist
    const galCount = await GalleryImage.countDocuments();
    if (galCount === 0) {
      await GalleryImage.insertMany([
        { title: 'International Conference 2023', description: 'Annual international conference on higher education', imageUrl: '/gallery-1.jpg', category: 'conference', eventYear: 2023 },
        { title: 'National Workshop 2024', description: 'Workshop on research methodologies', imageUrl: '/gallery-2.jpg', category: 'workshop', eventYear: 2024 },
        { title: 'Seminar Inauguration 2024', description: 'Inauguration of the academic seminar series', imageUrl: '/gallery-3.jpg', category: 'seminar', eventYear: 2024 }
      ]);
      console.log('Sample gallery images seeded');
    }

    console.log('Database seeding complete');
  } catch (err) {
    console.error('Seed error:', err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
